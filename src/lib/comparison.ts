import { Breed, BreedTraits, LocalizedString } from '@/types/breed'

export interface DimensionScore {
  dimension: string
  dimensionKey: string
  scoreA: number
  scoreB: number
  label: string
  description: string
}

export interface ComparisonResult {
  breedA: Breed
  breedB: Breed
  dimensions: DimensionScore[]
  summary: {
    totalA: number
    totalB: number
    winner: 'A' | 'B' | 'tie'
    strengthsA: string[]
    strengthsB: string[]
  }
}

function calculateEnergy(traits: BreedTraits): number {
  return Math.min(10, Math.max(1, traits.energy))
}

function calculateIntelligence(traits: BreedTraits): number {
  return Math.min(10, Math.max(1, traits.intelligence))
}

function calculateTrainability(traits: BreedTraits): number {
  const base = (traits.intelligence + traits.loyalty) / 2
  return Math.round(Math.min(10, Math.max(1, base)))
}

function calculateGrooming(sheddingLevel: number, coatLength: LocalizedString): number {
  const coatLengthLower = coatLength.en.toLowerCase()
  let coatBonus = 0
  if (coatLengthLower.includes('long') || coatLengthLower.includes('medium')) coatBonus = 2
  if (coatLengthLower.includes('short') || coatLengthLower.includes('hairless')) coatBonus = -1
  const rawScore = (sheddingLevel || 5) + coatBonus
  return Math.min(10, Math.max(1, Math.round(rawScore)))
}

function calculateShedding(sheddingLevel: number): number {
  return Math.min(10, Math.max(1, sheddingLevel || 5))
}

function calculateFriendliness(traits: BreedTraits): number {
  return Math.min(10, Math.max(1, traits.friendliness))
}

function calculateGoodWithKids(traits: BreedTraits): number {
  const base = (traits.friendliness + traits.temperament) / 2
  return Math.round(Math.min(10, Math.max(1, base)))
}

function calculateAdaptability(traits: BreedTraits): number {
  return Math.min(10, Math.max(1, traits.temperament))
}

function calculateHealth(diseases: Array<unknown>): number {
  const diseaseCount = diseases?.length || 0
  const baseScore = 10 - (diseaseCount * 0.5)
  return Math.round(Math.min(10, Math.max(1, baseScore)))
}

function calculateSize(weight: { male: string; female: string }): number {
  const extractWeight = (weightStr: string): number => {
    const match = weightStr.match(/(\d+)/)
    return match ? parseInt(match[1]) : 25
  }

  const maleWeight = extractWeight(weight.male)
  const femaleWeight = extractWeight(weight.female)
  const avgWeight = (maleWeight + femaleWeight) / 2

  if (avgWeight <= 10) return 3
  if (avgWeight <= 25) return 5
  if (avgWeight <= 50) return 7
  return 9
}

const DIMENSION_KEYS = [
  'energy', 'intelligence', 'trainability', 'grooming', 'shedding',
  'friendliness', 'goodWithKids', 'adaptability', 'health', 'size'
]

type ScorerFunc = (breed: Breed) => number

const SCORERS: ScorerFunc[] = [
  (b) => calculateEnergy(b.traits),
  (b) => calculateIntelligence(b.traits),
  (b) => calculateTrainability(b.traits),
  (b) => calculateGrooming(b.health.sheddingLevel, b.stats.coatLength),
  (b) => calculateShedding(b.health.sheddingLevel),
  (b) => calculateFriendliness(b.traits),
  (b) => calculateGoodWithKids(b.traits),
  (b) => calculateAdaptability(b.traits),
  (b) => calculateHealth(b.health.diseases),
  (b) => calculateSize(b.stats.weight)
]

export function compareBreeds(breedA: Breed, breedB: Breed): ComparisonResult {
  const dimensions: DimensionScore[] = DIMENSION_KEYS.map((key, index) => ({
    dimension: key,
    dimensionKey: key,
    scoreA: SCORERS[index](breedA),
    scoreB: SCORERS[index](breedB),
    label: `compare.dimensions.${key}`,
    description: `compare.dimensions.${key}Desc`
  }))

  const totalA = dimensions.reduce((sum, d) => sum + d.scoreA, 0)
  const totalB = dimensions.reduce((sum, d) => sum + d.scoreB, 0)

  const winner = totalA > totalB ? 'A' : totalB > totalA ? 'B' : 'tie'

  const strengthsA = dimensions.filter(d => d.scoreA > d.scoreB).map(d => d.dimension)
  const strengthsB = dimensions.filter(d => d.scoreB > d.scoreA).map(d => d.dimension)

  return {
    breedA,
    breedB,
    dimensions,
    summary: { totalA, totalB, winner, strengthsA, strengthsB }
  }
}

export function validateComparison(typeA: string, typeB: string): boolean {
  return typeA === typeB
}