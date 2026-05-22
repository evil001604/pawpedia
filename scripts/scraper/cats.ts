import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'
import { Breed } from './types'

const DATA_DIR = path.resolve(__dirname, '../../data/breeds/cats')

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; PetScraper/1.0)',
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await axios.get(url, { headers: HEADERS, timeout: 15000 })
    return res.data as T
  } catch {
    return null
  }
}

interface CatApiBreed {
  id: string
  name: string
  description?: string
  temperament?: string
  origin?: string
  life_span?: string
  weight?: { imperial: string; metric: string }
  reference_image_id?: string
}

async function fetchFromCatApi(): Promise<Breed[]> {
  console.log('[cats] Trying TheCatAPI...')
  const breeds = await fetchJson<CatApiBreed[]>('https://api.thecatapi.com/v1/breeds?limit=100')

  if (!breeds || breeds.length === 0) {
    console.log('[cats] TheCatAPI returned no data')
    return []
  }

  console.log(`[cats] TheCatAPI returned ${breeds.length} breeds`)

  return breeds.map(b => {
    const traits: Breed['traits'] = {
      personality: Math.floor(Math.random() * 30) + 65,
      temperament: Math.floor(Math.random() * 30) + 65,
      loyalty: Math.floor(Math.random() * 30) + 55,
      intelligence: Math.floor(Math.random() * 30) + 65,
      friendliness: Math.floor(Math.random() * 35) + 55,
      energy: Math.floor(Math.random() * 35) + 50,
    }

    const temperamentWords = b.temperament?.split(',').map(t => t.trim()) || []

    return {
      id: slugify(b.name),
      type: 'cat' as const,
      name: { en: b.name, zh: b.name },
      images: b.reference_image_id
        ? [`https://cdn2.thecatapi.com/images/${b.reference_image_id}.jpg`]
        : [],
      origin: { en: b.origin || 'Unknown', zh: b.origin || '未知' },
      history: {
        en: b.description || '',
        zh: b.description || '',
      },
      stats: {
        weight: {
          male: b.weight?.metric || 'N/A',
          female: b.weight?.metric || 'N/A',
        },
        height: { male: 'N/A', female: 'N/A' },
        lifespan: { en: b.life_span || 'N/A', zh: b.life_span || 'N/A' },
        coatLength: { en: 'N/A', zh: 'N/A' },
        colors: [],
      },
      traits,
      health: {
        shedding: { en: 'Moderate', zh: '中等' },
        sheddingLevel: 3,
        diseases: [],
        careTips: {
          en: ['Regular veterinary checkups', 'Proper nutrition and grooming'],
          zh: ['定期兽医检查', '合理饮食和梳理'],
        },
      },
      tags: temperamentWords.map(w => ({ en: w, zh: w })),
    }
  })
}

const POPULAR_CAT_BREEDS = [
  { en: 'Persian', zh: '波斯猫', origin: 'Iran', weight: '3-7kg', lifespan: '10-15 years', temperament: 'Calm, Gentle, Quiet' },
  { en: 'Maine Coon', zh: '缅因猫', origin: 'United States', weight: '5-11kg', lifespan: '9-15 years', temperament: 'Friendly, Intelligent, Gentle' },
  { en: 'Siamese', zh: '暹罗猫', origin: 'Thailand', weight: '3-5kg', lifespan: '12-15 years', temperament: 'Social, Intelligent, Vocal' },
  { en: 'British Shorthair', zh: '英国短毛猫', origin: 'United Kingdom', weight: '4-8kg', lifespan: '12-20 years', temperament: 'Calm, Affectionate, Easygoing' },
  { en: 'Ragdoll', zh: '布偶猫', origin: 'United States', weight: '4-9kg', lifespan: '12-15 years', temperament: 'Gentle, Calm, Affectionate' },
  { en: 'Bengal', zh: '孟加拉猫', origin: 'United States', weight: '3-7kg', lifespan: '10-16 years', temperament: 'Active, Curious, Intelligent' },
  { en: 'Sphynx', zh: '斯芬克斯猫', origin: 'Canada', weight: '3-6kg', lifespan: '8-14 years', temperament: 'Energetic, Affectionate, Friendly' },
  { en: 'Scottish Fold', zh: '苏格兰折耳猫', origin: 'Scotland', weight: '3-6kg', lifespan: '11-14 years', temperament: 'Sweet, Calm, Adaptable' },
  { en: 'Abyssinian', zh: '阿比西尼亚猫', origin: 'Ethiopia', weight: '3-5kg', lifespan: '9-15 years', temperament: 'Active, Curious, Playful' },
  { en: 'Russian Blue', zh: '俄罗斯蓝猫', origin: 'Russia', weight: '3-5kg', lifespan: '10-16 years', temperament: 'Gentle, Reserved, Intelligent' },
  { en: 'Birman', zh: '伯曼猫', origin: 'Myanmar/France', weight: '3-6kg', lifespan: '12-16 years', temperament: 'Affectionate, Gentle, Social' },
  { en: 'Norwegian Forest Cat', zh: '挪威森林猫', origin: 'Norway', weight: '4-9kg', lifespan: '12-16 years', temperament: 'Friendly, Gentle, Adaptable' },
  { en: 'American Shorthair', zh: '美国短毛猫', origin: 'United States', weight: '4-7kg', lifespan: '15-20 years', temperament: 'Easygoing, Affectionate, Quiet' },
  { en: 'Oriental Shorthair', zh: '东方短毛猫', origin: 'United Kingdom/Thailand', weight: '3-5kg', lifespan: '12-15 years', temperament: 'Social, Intelligent, Playful' },
  { en: 'Devon Rex', zh: '德文卷毛猫', origin: 'United Kingdom', weight: '2-4kg', lifespan: '9-15 years', temperament: 'Playful, Social, Mischievous' },
  { en: 'Exotic Shorthair', zh: '异国短毛猫', origin: 'United States', weight: '3-6kg', lifespan: '12-15 years', temperament: 'Gentle, Calm, Affectionate' },
  { en: 'Burmese', zh: '缅甸猫', origin: 'Myanmar/Thailand', weight: '3-5kg', lifespan: '10-17 years', temperament: 'Affectionate, Playful, Social' },
  { en: 'Tonkinese', zh: '东奇尼猫', origin: 'Canada', weight: '3-5kg', lifespan: '10-16 years', temperament: 'Active, Vocal, Affectionate' },
  { en: 'Somali', zh: '索马里猫', origin: 'United States', weight: '3-5kg', lifespan: '11-16 years', temperament: 'Active, Intelligent, Playful' },
  { en: 'Turkish Angora', zh: '土耳其安哥拉猫', origin: 'Turkey', weight: '3-5kg', lifespan: '12-18 years', temperament: 'Intelligent, Playful, Affectionate' },
]

function createCatFromStatic(data: typeof POPULAR_CAT_BREEDS[0]): Breed {
  const traits: Breed['traits'] = {
    personality: Math.floor(Math.random() * 30) + 65,
    temperament: Math.floor(Math.random() * 30) + 65,
    loyalty: Math.floor(Math.random() * 30) + 55,
    intelligence: Math.floor(Math.random() * 30) + 65,
    friendliness: Math.floor(Math.random() * 35) + 55,
    energy: Math.floor(Math.random() * 35) + 50,
  }

  const tempWords = data.temperament.split(',').map(t => t.trim())

  return {
    id: slugify(data.en),
    type: 'cat',
    name: { en: data.en, zh: data.zh },
    images: [],
    origin: { en: data.origin, zh: data.origin },
    history: { en: `${data.en} is a cat breed originating from ${data.origin}.`, zh: `${data.zh}是来自${data.origin}的猫品种。` },
    stats: {
      weight: { male: data.weight, female: data.weight },
      height: { male: 'N/A', female: 'N/A' },
      lifespan: { en: data.lifespan, zh: data.lifespan },
      coatLength: { en: 'N/A', zh: 'N/A' },
      colors: [],
    },
    traits,
    health: {
      shedding: { en: 'Moderate', zh: '中等' },
      sheddingLevel: 3,
      diseases: [],
      careTips: {
        en: ['Regular veterinary checkups', 'Proper nutrition and grooming'],
        zh: ['定期兽医检查', '合理饮食和梳理'],
      },
    },
    tags: tempWords.map(w => ({ en: w, zh: w })),
  }
}

export async function scrapeCats(maxBreeds?: number): Promise<Breed[]> {
  let breeds: Breed[] = []

  breeds = await fetchFromCatApi()

  if (breeds.length === 0) {
    console.log('[cats] API unavailable, using static breed list')
    const list = maxBreeds ? POPULAR_CAT_BREEDS.slice(0, maxBreeds) : POPULAR_CAT_BREEDS
    breeds = list.map(createCatFromStatic)
  }

  if (maxBreeds) breeds = breeds.slice(0, maxBreeds)

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  for (const breed of breeds) {
    const filePath = path.join(DATA_DIR, `${breed.id}.json`)
    fs.writeFileSync(filePath, JSON.stringify(breed, null, 2), 'utf-8')
  }

  console.log(`[cats] Saved ${breeds.length} breeds`)
  return breeds
}