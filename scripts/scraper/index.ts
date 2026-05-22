import { scrapeDogs } from './dogs'
import { scrapeCats } from './cats'
import { downloadBreedImages } from './images'
import * as fs from 'fs'
import * as path from 'path'

async function main() {
  const args = process.argv.slice(2)
  const mode = args[0] || 'all'
  const limit = args[1] ? parseInt(args[1]) : undefined

  console.log('=== Pet Breed Scraper ===')
  console.log(`Mode: ${mode}${limit ? ` (limit: ${limit})` : ''}`)
  console.log('')

  if (mode === 'dogs' || mode === 'all') {
    console.log('--- Scraping Dog Breeds ---')
    const dogs = await scrapeDogs(limit)
    console.log(`Total dog breeds scraped: ${dogs.length}`)
  }

  if (mode === 'cats' || mode === 'all') {
    console.log('\n--- Scraping Cat Breeds ---')
    const cats = await scrapeCats(limit)
    console.log(`Total cat breeds scraped: ${cats.length}`)
  }

  if (mode === 'images' || mode === 'all') {
    console.log('\n--- Downloading Images ---')
    const allBreeds: { id: string; type: string; images: string[] }[] = []

    const dogsDir = path.resolve(__dirname, '../../data/breeds/dogs')
    const catsDir = path.resolve(__dirname, '../../data/breeds/cats')

    for (const dir of [dogsDir, catsDir]) {
      if (!fs.existsSync(dir)) continue
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'))
      for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
        if (data.images && data.images.length > 0) {
          allBreeds.push({
            id: data.id,
            type: data.type,
            images: data.images,
          })
        }
      }
    }

    await downloadBreedImages(allBreeds)
  }

  console.log('\n=== Scraping Complete ===')
}

main().catch(console.error)