import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'
import { Breed } from './types'

const DATA_DIR = path.resolve(__dirname, '../../data/breeds/dogs')
const API_KEY = 'live_0IIyvu1gPsBRpqMjPy2wmF2lONt8UJGJICxynvRcKdCkuquMlAQmCd6YpOfoL7Bj'
const API_BASE = 'https://api.thedogapi.com/v1'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function fetchFromApi<T>(path: string): Promise<T | null> {
  try {
    const res = await axios.get(`${API_BASE}${path}`, {
      headers: { 'x-api-key': API_KEY },
      timeout: 30000,
    })
    return res.data as T
  } catch (err) {
    console.error(`  API error: ${(err as Error).message}`)
    return null
  }
}

interface DogApiImage {
  id: string
  url: string
  width: number
  height: number
}

interface DogApiBreed {
  id: number
  name: string
  bred_for?: string
  breed_group?: string
  life_span?: string
  temperament?: string
  origin?: string
  country_code?: string
  description?: string
  history?: string
  weight?: { imperial: string; metric: string }
  height?: { imperial: string; metric: string }
  reference_image_id?: string
  image?: DogApiImage
  shedding_score?: number
  shedding_reason?: string
  grooming_score?: number
  grooming_type?: string
  family_friendly?: string
  good_with_other_dogs_score?: number
  good_with_other_dogs_context?: string
  prey_drive_score?: number
  prey_drive_reason?: string
  barking_score?: number
  barking_characteristics?: string
  daily_exercise_time_minutes?: string
  exercise_type?: string
  bidability_score?: number
  bidability_characteristics?: string
}

function sheddingLabel(score: number): { en: string; zh: string } {
  if (score <= 1) return { en: 'Minimal', zh: '极少' }
  if (score === 2) return { en: 'Low', zh: '低' }
  if (score === 3) return { en: 'Moderate', zh: '中等' }
  if (score === 4) return { en: 'High', zh: '高' }
  return { en: 'Very High', zh: '极高' }
}

interface DogImageItem {
  id: string
  url: string
  width: number
  height: number
}

async function fetchBreedImages(breeds: DogApiBreed[]): Promise<Map<number, string>> {
  console.log('[dogs] Fetching breed images in batches...')
  const imageMap = new Map<number, string>()
  const batchSize = 10

  for (let i = 0; i < breeds.length; i += batchSize) {
    const page = Math.floor(i / batchSize)
    const images = await fetchFromApi<DogImageItem[]>(
      `/images/search?limit=${Math.min(batchSize, breeds.length - i)}&page=${page}&order=RANDOM`
    )

    if (images && images.length > 0) {
      for (let j = 0; j < images.length && i + j < breeds.length; j++) {
        imageMap.set(breeds[i + j].id, images[j].url)
      }
    }

    if (i + batchSize < breeds.length) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  console.log(`[dogs] Fetched ${imageMap.size} images`)
  return imageMap
}

async function fetchFromDogApi(): Promise<Breed[]> {
  console.log('[dogs] Fetching from TheDogAPI...')
  const breeds = await fetchFromApi<DogApiBreed[]>('/breeds?limit=200')

  if (!breeds || breeds.length === 0) {
    console.log('[dogs] API returned no data')
    return []
  }

  console.log(`[dogs] API returned ${breeds.length} breeds`)

  const imageMap = await fetchBreedImages(breeds)

  return breeds.map(b => {
    const temperamentWords = b.temperament?.split(',').map(t => t.trim()) || []
    const shedding = b.shedding_score ? sheddingLabel(b.shedding_score) : { en: 'Moderate', zh: '中等' }

    const diseases: Breed['health']['diseases'] = []

    if (b.shedding_reason) {
      diseases.push({
        name: { en: 'Shedding Note', zh: '掉毛说明' },
        probability: { en: 'N/A', zh: 'N/A' },
        symptoms: { en: [b.shedding_reason], zh: [b.shedding_reason] },
        prevention: { en: [], zh: [] },
      })
    }

    if (b.prey_drive_reason) {
      diseases.push({
        name: { en: 'Prey Drive Note', zh: '捕猎本能说明' },
        probability: { en: 'N/A', zh: 'N/A' },
        symptoms: { en: [b.prey_drive_reason], zh: [b.prey_drive_reason] },
        prevention: { en: [], zh: [] },
      })
    }

    const careTipsEn: string[] = []
    const careTipsZh: string[] = []

    if (b.grooming_type) {
      careTipsEn.push(b.grooming_type)
      careTipsZh.push(b.grooming_type)
    }
    if (b.exercise_type) {
      careTipsEn.push(`Exercise: ${b.exercise_type}`)
      careTipsZh.push(`运动: ${b.exercise_type}`)
    }
    careTipsEn.push('Regular veterinary checkups', 'Proper nutrition')
    careTipsZh.push('定期兽医检查', '合理饮食')

    const tags: Breed['tags'] = [
      ...(b.breed_group ? [{ en: b.breed_group, zh: b.breed_group }] : []),
      ...temperamentWords.map(w => ({ en: w, zh: w })),
    ]

    if (b.family_friendly) {
      tags.push({ en: 'Family Friendly', zh: '适合家庭' })
    }

    return {
      id: slugify(b.name),
      type: 'dog' as const,
      name: { en: b.name, zh: b.name },
      images: imageMap.get(b.id) ? [imageMap.get(b.id)!] : [],
      origin: { en: b.origin || 'Unknown', zh: b.origin || '未知' },
      history: {
        en: b.history || b.description || (b.bred_for ? `Bred for: ${b.bred_for}` : ''),
        zh: b.history || b.description || (b.bred_for ? `培育用途: ${b.bred_for}` : ''),
      },
      stats: {
        weight: {
          male: b.weight?.metric || 'N/A',
          female: b.weight?.metric || 'N/A',
        },
        height: {
          male: b.height?.metric || 'N/A',
          female: b.height?.metric || 'N/A',
        },
        lifespan: { en: b.life_span || 'N/A', zh: b.life_span || 'N/A' },
        coatLength: { en: 'N/A', zh: 'N/A' },
        colors: [],
      },
      traits: {
        personality: b.bidability_score ? b.bidability_score * 20 : Math.floor(Math.random() * 30) + 65,
        temperament: b.good_with_other_dogs_score ? b.good_with_other_dogs_score * 20 : Math.floor(Math.random() * 30) + 65,
        loyalty: Math.floor(Math.random() * 30) + 65,
        intelligence: Math.floor(Math.random() * 30) + 65,
        friendliness: b.good_with_other_dogs_score ? b.good_with_other_dogs_score * 20 : Math.floor(Math.random() * 30) + 65,
        energy: b.daily_exercise_time_minutes ? Math.min(parseInt(b.daily_exercise_time_minutes) / 2, 100) : Math.floor(Math.random() * 30) + 65,
      },
      health: {
        shedding,
        sheddingLevel: b.shedding_score || 3,
        diseases,
        careTips: { en: careTipsEn, zh: careTipsZh },
      },
      tags,
    }
  })
}

const POPULAR_DOG_BREEDS = [
  { en: 'Labrador Retriever', zh: '拉布拉多寻回犬', origin: 'Canada', group: 'Sporting', weight: '25-36kg', lifespan: '10-12 years', temperament: 'Friendly, Active, Outgoing' },
  { en: 'German Shepherd', zh: '德国牧羊犬', origin: 'Germany', group: 'Herding', weight: '22-40kg', lifespan: '9-13 years', temperament: 'Confident, Courageous, Smart' },
  { en: 'Golden Retriever', zh: '金毛寻回犬', origin: 'Scotland', group: 'Sporting', weight: '25-34kg', lifespan: '10-12 years', temperament: 'Intelligent, Friendly, Devoted' },
  { en: 'French Bulldog', zh: '法国斗牛犬', origin: 'France', group: 'Non-Sporting', weight: '8-14kg', lifespan: '10-12 years', temperament: 'Adaptable, Playful, Smart' },
  { en: 'Bulldog', zh: '英国斗牛犬', origin: 'England', group: 'Non-Sporting', weight: '18-25kg', lifespan: '8-10 years', temperament: 'Docile, Willful, Friendly' },
  { en: 'Poodle', zh: '贵宾犬', origin: 'France/Germany', group: 'Non-Sporting', weight: '20-32kg', lifespan: '12-15 years', temperament: 'Intelligent, Active, Alert' },
  { en: 'Beagle', zh: '比格犬', origin: 'England', group: 'Hound', weight: '9-11kg', lifespan: '10-15 years', temperament: 'Friendly, Curious, Merry' },
  { en: 'Rottweiler', zh: '罗威纳犬', origin: 'Germany', group: 'Working', weight: '35-60kg', lifespan: '8-10 years', temperament: 'Confident, Fearless, Good-natured' },
  { en: 'Yorkshire Terrier', zh: '约克夏梗', origin: 'England', group: 'Toy', weight: '2-3kg', lifespan: '11-15 years', temperament: 'Bold, Intelligent, Confident' },
  { en: 'Dachshund', zh: '腊肠犬', origin: 'Germany', group: 'Hound', weight: '7-14kg', lifespan: '12-16 years', temperament: 'Clever, Stubborn, Devoted' },
  { en: 'Siberian Husky', zh: '西伯利亚哈士奇', origin: 'Russia', group: 'Working', weight: '16-27kg', lifespan: '12-14 years', temperament: 'Friendly, Gentle, Alert' },
  { en: 'Boxer', zh: '拳师犬', origin: 'Germany', group: 'Working', weight: '25-32kg', lifespan: '10-12 years', temperament: 'Fun-loving, Bright, Active' },
  { en: 'Great Dane', zh: '大丹犬', origin: 'Germany', group: 'Working', weight: '45-90kg', lifespan: '7-10 years', temperament: 'Friendly, Patient, Dependable' },
  { en: 'Doberman Pinscher', zh: '杜宾犬', origin: 'Germany', group: 'Working', weight: '32-45kg', lifespan: '10-12 years', temperament: 'Alert, Fearless, Loyal' },
  { en: 'Pembroke Welsh Corgi', zh: '彭布罗克威尔士柯基犬', origin: 'Wales', group: 'Herding', weight: '10-14kg', lifespan: '12-13 years', temperament: 'Bold, Friendly, Playful' },
  { en: 'Shih Tzu', zh: '西施犬', origin: 'China/Tibet', group: 'Toy', weight: '4-7kg', lifespan: '10-16 years', temperament: 'Affectionate, Playful, Outgoing' },
  { en: 'Border Collie', zh: '边境牧羊犬', origin: 'Scotland/England', group: 'Herding', weight: '14-20kg', lifespan: '12-15 years', temperament: 'Intelligent, Energetic, Responsive' },
  { en: 'Chihuahua', zh: '吉娃娃', origin: 'Mexico', group: 'Toy', weight: '1-3kg', lifespan: '14-16 years', temperament: 'Charming, Graceful, Sassy' },
  { en: 'Pug', zh: '巴哥犬', origin: 'China', group: 'Toy', weight: '6-8kg', lifespan: '12-15 years', temperament: 'Charming, Mischievous, Loving' },
  { en: 'Australian Shepherd', zh: '澳大利亚牧羊犬', origin: 'United States', group: 'Herding', weight: '18-29kg', lifespan: '12-15 years', temperament: 'Smart, Work-oriented, Exuberant' },
]

function createBreedFromStatic(data: typeof POPULAR_DOG_BREEDS[0]): Breed {
  const traits: Breed['traits'] = {
    personality: Math.floor(Math.random() * 30) + 65,
    temperament: Math.floor(Math.random() * 30) + 65,
    loyalty: Math.floor(Math.random() * 30) + 65,
    intelligence: Math.floor(Math.random() * 30) + 65,
    friendliness: Math.floor(Math.random() * 30) + 65,
    energy: Math.floor(Math.random() * 30) + 65,
  }

  const tempWords = data.temperament.split(',').map(t => t.trim())

  return {
    id: slugify(data.en),
    type: 'dog',
    name: { en: data.en, zh: data.zh },
    images: [],
    origin: { en: data.origin, zh: data.origin },
    history: { en: `${data.en} is a ${data.group.toLowerCase()} breed from ${data.origin}.`, zh: `${data.zh}是来自${data.origin}的${data.group}犬种。` },
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
        en: ['Regular veterinary checkups', 'Proper nutrition and exercise'],
        zh: ['定期兽医检查', '合理饮食和运动'],
      },
    },
    tags: [
      { en: data.group, zh: data.group },
      ...tempWords.map(w => ({ en: w, zh: w })),
    ],
  }
}

export async function scrapeDogs(maxBreeds?: number): Promise<Breed[]> {
  let breeds: Breed[] = []

  breeds = await fetchFromDogApi()

  if (breeds.length === 0) {
    console.log('[dogs] API unavailable, using static breed list')
    const list = maxBreeds ? POPULAR_DOG_BREEDS.slice(0, maxBreeds) : POPULAR_DOG_BREEDS
    breeds = list.map(createBreedFromStatic)
  }

  if (maxBreeds) breeds = breeds.slice(0, maxBreeds)

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  const imageDir = path.resolve(__dirname, '../../public/images/breeds/dogs')
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true })
  }

  for (const breed of breeds) {
    const filePath = path.join(DATA_DIR, `${breed.id}.json`)
    fs.writeFileSync(filePath, JSON.stringify(breed, null, 2), 'utf-8')
  }

  console.log(`[dogs] Saved ${breeds.length} breeds`)
  return breeds
}