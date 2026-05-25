"use client"

import { useState } from "react"
import { Breed, Locale, PetType } from "@/types/breed"
import BreedCard from "@/components/BreedCard"
import { searchBreeds } from "@/lib/breeds-client"

export default function BreedListClient({
  breeds,
  locale,
  searchPlaceholder,
  noResults,
}: {
  breeds: Breed[]
  locale: string
  type: PetType
  searchPlaceholder: string
  noResults: string
}) {
  const [query, setQuery] = useState("")
  const filtered = query ? searchBreeds(query, breeds) : breeds

  return (
    <>
      <div className="mt-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 sm:max-w-md"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-stone-500">{noResults}</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((breed) => (
            <BreedCard key={breed.id} breed={breed} locale={locale as Locale} />
          ))}
        </div>
      )}
    </>
  )
}