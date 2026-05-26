import { Breed } from "@/types/breed"

export function getSimilarBreeds(breed: Breed, allBreeds: Breed[], limit = 4): Breed[] {
  const targetTags = new Set(breed.tags.map(t => t.en.toLowerCase()))

  const scored = allBreeds
    .filter(b => b.id !== breed.id)
    .map(b => {
      const overlap = b.tags.filter(t => targetTags.has(t.en.toLowerCase())).length
      return { breed: b, overlap }
    })
    .sort((a, b) => b.overlap - a.overlap)

  const result = scored.slice(0, limit).map(s => s.breed)

  if (result.length < limit) {
    const existingIds = new Set([breed.id, ...result.map(b => b.id)])
    const remaining = allBreeds.filter(b => !existingIds.has(b.id))
    const shuffled = remaining.sort(() => Math.random() - 0.5)
    result.push(...shuffled.slice(0, limit - result.length))
  }

  return result
}