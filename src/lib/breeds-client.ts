import { Breed } from "@/types/breed"

export function searchBreeds(query: string, breeds: Breed[]): Breed[] {
  const q = query.toLowerCase()
  return breeds.filter(
    (b) =>
      b.name.en.toLowerCase().includes(q) ||
      b.name.zh.includes(q) ||
      b.tags.some((t) => t.en.toLowerCase().includes(q) || t.zh.includes(q))
  )
}