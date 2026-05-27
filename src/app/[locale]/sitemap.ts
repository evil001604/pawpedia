import { getAllBreedIds } from "@/lib/breeds"
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pawpedia.xyz"
  const locales = ["en", "zh"]
  const breeds = getAllBreedIds()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    entries.push({ url: `${baseUrl}/${locale}`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 })
    entries.push({ url: `${baseUrl}/${locale}/breeds/dog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 })
    entries.push({ url: `${baseUrl}/${locale}/breeds/cat`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 })
    entries.push({ url: `${baseUrl}/${locale}/diagnose`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 })
    entries.push({ url: `${baseUrl}/${locale}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 })
    entries.push({ url: `${baseUrl}/${locale}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 })
    entries.push({ url: `${baseUrl}/${locale}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 })
    entries.push({ url: `${baseUrl}/${locale}/quiz`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 })
    for (const breed of breeds) {
      entries.push({ url: `${baseUrl}/${locale}/breeds/${breed.type}/${breed.id}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 })
    }
  }

  return entries
}