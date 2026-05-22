import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'

const IMG_DIR = path.resolve(__dirname, '../../public/images/breeds')

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
}

export async function downloadImage(url: string, breedType: string, breedId: string, index: number): Promise<string | null> {
  if (url.startsWith('/')) {
    return url
  }

  const dir = path.join(IMG_DIR, breedType === 'dog' ? 'dogs' : 'cats')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const ext = path.extname(new URL(url).pathname).split('?')[0] || '.jpg'
  const filename = `${breedId}-${index}${ext}`
  const filepath = path.join(dir, filename)

  try {
    const res = await axios.get(url, {
      headers: HEADERS,
      responseType: 'arraybuffer',
      timeout: 15000,
    })

    fs.writeFileSync(filepath, res.data)
    console.log(`  Downloaded: ${filename} (${(res.data.length / 1024).toFixed(1)}KB)`)
    return `/images/breeds/${breedType === 'dog' ? 'dogs' : 'cats'}/${filename}`
  } catch (err) {
    console.error(`  Failed to download ${url}:`, (err as Error).message)
    return null
  }
}

export async function downloadBreedImages(breeds: { id: string; type: string; images: string[] }[]): Promise<void> {
  console.log(`\nDownloading images for ${breeds.length} breeds...`)

  for (const breed of breeds) {
    const localImages: string[] = []

    for (let i = 0; i < Math.min(breed.images.length, 3); i++) {
      const localPath = await downloadImage(breed.images[i], breed.type, breed.id, i + 1)
      if (localPath) localImages.push(localPath)
    }

    if (localImages.length > 0) {
      const dataDir = path.resolve(
        __dirname,
        `../../data/breeds/${breed.type === 'dog' ? 'dogs' : 'cats'}/${breed.id}.json`
      )

      if (fs.existsSync(dataDir)) {
        const data = JSON.parse(fs.readFileSync(dataDir, 'utf-8'))
        data.images = localImages
        fs.writeFileSync(dataDir, JSON.stringify(data, null, 2), 'utf-8')
      }
    }

    await new Promise(resolve => setTimeout(resolve, 300))
  }

  console.log('Image download complete')
}