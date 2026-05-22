export interface LocalizedString {
  en: string
  zh: string
}

export interface BreedStats {
  weight: { male: string; female: string }
  height: { male: string; female: string }
  lifespan: LocalizedString
  coatLength: LocalizedString
  colors: LocalizedString[]
}

export interface BreedTraits {
  personality: number
  temperament: number
  loyalty: number
  intelligence: number
  friendliness: number
  energy: number
}

export interface LocalizedArray {
  en: string[]
  zh: string[]
}

export interface BreedDisease {
  name: LocalizedString
  probability: LocalizedString
  symptoms: LocalizedArray
  prevention: LocalizedArray
}

export interface BreedHealth {
  shedding: LocalizedString
  sheddingLevel: number
  diseases: BreedDisease[]
  careTips: LocalizedArray
}

export interface Breed {
  id: string
  type: 'dog' | 'cat'
  name: LocalizedString
  images: string[]
  origin: LocalizedString
  history: LocalizedString
  stats: BreedStats
  traits: BreedTraits
  health: BreedHealth
  tags: LocalizedString[]
}