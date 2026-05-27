const fs = require("fs")
const path = require("path")

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local")
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, "utf-8")
  for (const line of content.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eqIdx = trimmed.indexOf("=")
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const value = trimmed.slice(eqIdx + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}
loadEnv()

const API_KEY = process.env.DEEPSEEK_API_KEY
if (!API_KEY) {
  console.error("DEEPSEEK_API_KEY not set in .env.local")
  process.exit(1)
}

const DATA_DIR = path.join(__dirname, "..", "data", "breeds")

function getAllBreedFiles() {
  const files = []
  for (const type of ["dogs", "cats"]) {
    const dir = path.join(DATA_DIR, type)
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".json"))) {
      files.push({ type: type === "dogs" ? "dog" : "cat", filePath: path.join(dir, f) })
    }
  }
  return files
}

function buildPrompt(breed) {
  const tags = breed.tags?.map(t => t.en).join(", ") || ""
  return `You are a pet breed expert. Write a comprehensive care guide for the ${breed.name.en} (${breed.type}) in BOTH English and Chinese (zh).

Breed data:
- Name: ${breed.name.en} / ${breed.name.zh}
- Origin: ${breed.origin.en} / ${breed.origin.zh}
- Tags: ${tags}
- History: ${breed.history?.en || "N/A"}

Write a structured JSON object with these 5 sections (each with "en" and "zh" fields, each 100-200 words):
1. overview - breed personality and characteristics summary
2. care - daily care routine (grooming, exercise, vet visits)
3. training - training approach and tips
4. diet - feeding and nutrition guidance
5. livingTips - home environment, apartment/yard suitability, compatibility with children/pets

Return ONLY valid JSON in this exact format, no markdown, no code blocks:
{"overview":{"en":"...","zh":"..."},"care":{"en":"...","zh":"..."},"training":{"en":"...","zh":"..."},"diet":{"en":"...","zh":"..."},"livingTips":{"en":"...","zh":"..."}}`
}

async function generateCareGuide(breed) {
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: buildPrompt(breed) }],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content || ""

  const cleaned = content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .replace(/\/\/[^\n]*/g, "")
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error("Failed to parse JSON from response")
  }
}

async function main() {
  const files = getAllBreedFiles()
  console.log(`Found ${files.length} breed files`)

  let processed = 0
  let skipped = 0
  let failed = 0

  for (let i = 0; i < files.length; i++) {
    const { filePath } = files[i]
    const breed = JSON.parse(fs.readFileSync(filePath, "utf-8"))

    if (breed.careGuide) {
      skipped++
      continue
    }

    const label = `${breed.name.en} (${breed.type})`
    console.log(`[${i + 1}/${files.length}] ${label} ...`)

    try {
      let careGuide
      let attempts = 0
      while (attempts < 3) {
        try {
          careGuide = await generateCareGuide(breed)
          break
        } catch (innerErr) {
          attempts++
          if (attempts >= 3) throw innerErr
          await new Promise(r => setTimeout(r, 2000))
        }
      }
      breed.careGuide = careGuide
      fs.writeFileSync(filePath, JSON.stringify(breed, null, 2), "utf-8")
      console.log("OK")
      processed++
    } catch (err) {
      console.log(`FAILED: ${err.message}`)
      failed++
    }

    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\nDone: ${processed} generated, ${skipped} skipped, ${failed} failed`)
}

main().catch(console.error)