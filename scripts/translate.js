const fs = require('fs')
const path = require('path')

const BREEDS_DIR = path.resolve(__dirname, '../data/breeds')

const envPath = path.resolve(__dirname, '../.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const eq = line.indexOf('=')
    if (eq > 0) process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
  }
}
const API_KEY = process.env.DEEPSEEK_API_KEY || ''
const API_URL = 'https://api.deepseek.com/v1/chat/completions'

async function chat(systemPrompt, userMessage) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  })
  const text = await res.text()
  if (!res.ok) {
    console.error(`  API error ${res.status}: ${text.slice(0, 300)}`)
    throw new Error(`HTTP ${res.status}`)
  }
  const data = JSON.parse(text)
  if (data.error) {
    console.error(`  API error:`, JSON.stringify(data.error))
    throw new Error(data.error.message || 'API error')
  }
  return data.choices[0].message.content.trim()
}

function loadBreeds(subdir) {
  const dir = path.join(BREEDS_DIR, subdir)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'))
    return { file: f, dir: subdir, data }
  })
}

function saveBreed(entry) {
  const fp = path.join(BREEDS_DIR, entry.dir, entry.file)
  fs.writeFileSync(fp, JSON.stringify(entry.data, null, 2), 'utf-8')
}

const COAT_MAP = {
  'Short': '短毛', 'Medium': '中长毛', 'Long': '长毛', 'N/A': 'N/A',
  'short': '短毛', 'medium': '中长毛', 'long': '长毛', 'Hairless': '无毛',
  'Curly': '卷毛', 'Wire': '刚毛', 'Silky': '丝质毛',
}

function applySimpleMappings(entries) {
  for (const entry of entries) {
    const d = entry.data
    if (COAT_MAP[d.stats.coatLength.en]) d.stats.coatLength.zh = COAT_MAP[d.stats.coatLength.en]
    d.stats.lifespan.zh = d.stats.lifespan.en
    saveBreed(entry)
  }
}

async function translateNamesOriginsTags(entries) {
  const items = []
  for (const entry of entries) {
    const d = entry.data
    if (d.name.zh === d.name.en || d.origin.zh === d.origin.en || d.tags.some(t => t.zh === t.en)) {
      items.push({ entry, name_en: d.name.en, origin_en: d.origin.en, tags_en: d.tags.filter(t => t.zh === t.en).map(t => t.en) })
    }
  }
  if (items.length === 0) return

  const BATCH = 30
  for (let i = 0; i < items.length; i += BATCH) {
    const batch = items.slice(i, i + BATCH)
    const lines = batch.map((it, idx) =>
      `[${idx}]\nName: ${it.name_en}\nOrigin: ${it.origin_en}\nTags: ${it.tags_en.join(' | ')}`
    ).join('\n\n')

    const prompt = `Translate the following dog/cat breed names, origins, and tags into Chinese. Rules:\n1. Breed names: use standard Chinese breed names (e.g., "Golden Retriever" → "金毛寻回犬", "Siamese" → "暹罗猫").\n2. Origins: translate country/region names to Chinese (e.g., "Japan" → "日本").\n3. Tags: translate temperament/usage tags concisely (e.g., "Working" → "工作犬", "Friendly" → "友善").\n4. Return ONLY a JSON object with numeric keys mapping to {name, origin, tags} where tags is an array in the same order as input.\n\nInput:\n${lines}`

    console.log(`  Batch ${Math.floor(i/BATCH)+1}/${Math.ceil(items.length/BATCH)}: ${batch.length} breeds`)
    const response = await chat('You are a professional pet breed translator. Output ONLY valid JSON.', prompt)
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      const result = JSON.parse(jsonMatch[0])
      for (let j = 0; j < batch.length; j++) {
        const key = String(j)
        if (result[key]) {
          const entry = batch[j].entry
          if (result[key].name) entry.data.name.zh = result[key].name
          if (result[key].origin) entry.data.origin.zh = result[key].origin
          if (result[key].tags) {
            let ti = 0
            for (const tag of entry.data.tags) {
              if (tag.zh === tag.en && ti < result[key].tags.length) { tag.zh = result[key].tags[ti]; ti++ }
            }
          }
          saveBreed(entry)
        }
      }
    } catch (e) {
      console.error(`  Batch parse error:`, e.message, response.slice(0, 200))
    }
    if (i + BATCH < items.length) await new Promise(r => setTimeout(r, 2000))
  }
}

async function translateHistory(entries) {
  const items = entries.filter(e => e.data.history && e.data.history.zh === e.data.history.en)
  if (items.length === 0) return

  const BATCH = 15
  for (let i = 0; i < items.length; i += BATCH) {
    const batch = items.slice(i, i + BATCH)
    const lines = batch.map((it, idx) => `[${idx}] ${it.data.history.en.slice(0, 800)}`).join('\n\n')

    const prompt = `Translate the following dog/cat breed history descriptions into Chinese. Rules:\n1. Keep breed names in original English or standard Chinese form.\n2. Use natural, fluent Chinese. Preserve all factual information.\n3. Return ONLY a JSON object with numeric keys mapping to the translated Chinese text.\n\nInput:\n${lines}`

    console.log(`  History batch ${Math.floor(i/BATCH)+1}/${Math.ceil(items.length/BATCH)}: ${batch.length} breeds`)
    const response = await chat('You are a professional pet breed history translator. Output ONLY valid JSON.', prompt)
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      const result = JSON.parse(jsonMatch[0])
      for (let j = 0; j < batch.length; j++) {
        const key = String(j)
        if (result[key]) { batch[j].data.history.zh = result[key]; saveBreed(batch[j]) }
      }
    } catch (e) {
      console.error(`  History batch parse error:`, e.message)
    }
    if (i + BATCH < items.length) await new Promise(r => setTimeout(r, 2000))
  }
}

async function main() {
  console.log('=== PetPedia Breed Translator (DeepSeek) ===\n')
  const dogs = loadBreeds('dogs')
  const cats = loadBreeds('cats')
  const all = [...dogs, ...cats]
  console.log(`Loaded ${dogs.length} dogs + ${cats.length} cats = ${all.length} breeds\n`)

  console.log('[1/4] Simple mappings (lifespan, coatLength)...')
  applySimpleMappings(all)
  console.log('  Done.\n')

  console.log('[2/4] Translating names, origins, tags...')
  await translateNamesOriginsTags(all)
  console.log('  Done.\n')

  console.log('[3/4] Translating history texts...')
  await translateHistory(all)
  console.log('  Done.\n')

  console.log('[4/4] Verification...')
  let nameDone = 0, originDone = 0, tagsDone = 0, historyDone = 0
  for (const entry of all) {
    if (entry.data.name.zh !== entry.data.name.en) nameDone++
    if (entry.data.origin.zh !== entry.data.origin.en) originDone++
    if (entry.data.tags.every(t => t.zh !== t.en)) tagsDone++
    if (entry.data.history && entry.data.history.zh !== entry.data.history.en) historyDone++
  }
  console.log(`  name: ${nameDone}/${all.length}`)
  console.log(`  origin: ${originDone}/${all.length}`)
  console.log(`  tags: ${tagsDone}/${all.length}`)
  console.log(`  history: ${historyDone}/${all.length}`)
  console.log('\n=== Done! ===')
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1) })