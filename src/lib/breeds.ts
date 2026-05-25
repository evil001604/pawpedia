import fs from "fs"
import path from "path"
import { Breed, PetType } from "@/types/breed"

const DATA_DIR = path.join(process.cwd(), "data", "breeds")

export function loadBreeds(type: PetType): Breed[] {
  const dir = path.join(DATA_DIR, type === "dog" ? "dogs" : "cats")
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"))
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8")
    return JSON.parse(raw) as Breed
  })
}

export function loadBreed(type: PetType, id: string): Breed | null {
  const filePath = path.join(DATA_DIR, type === "dog" ? "dogs" : "cats", `${id}.json`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(raw) as Breed
}

export function getAllBreedIds(): { type: PetType; id: string }[] {
  const result: { type: PetType; id: string }[] = []
  for (const t of ["dog", "cat"] as PetType[]) {
    const dir = path.join(DATA_DIR, t === "dog" ? "dogs" : "cats")
    if (!fs.existsSync(dir)) continue
    fs.readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .forEach((f) => result.push({ type: t, id: f.replace(".json", "") }))
  }
  return result
}