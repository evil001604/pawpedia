'use client'

import { Breed, Locale } from '@/types/breed'
import Link from 'next/link'

export default function SimilarBreeds({
  breeds,
  locale,
  title,
}: {
  breeds: Breed[]
  locale: Locale
  title: string
}) {
  if (breeds.length === 0) return null

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold text-stone-900">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {breeds.map((breed) => (
          <Link
            key={breed.id}
            href={`/${locale}/breeds/${breed.type}s/${breed.id}`}
            className="group rounded-xl border border-stone-200 bg-white p-4 transition-all hover:border-amber-300 hover:shadow-md"
          >
            <div className="mb-3 h-32 w-full overflow-hidden rounded-lg">
              {breed.images?.[0] ? (
                <img
                  src={breed.images[0]}
                  alt={breed.name[locale]}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-stone-100 text-3xl text-stone-300">
                  Paw
                </div>
              )}
            </div>
            <p className="text-sm font-semibold text-stone-800 group-hover:text-amber-700">
              {breed.name[locale]}
            </p>
            <p className="mt-1 text-xs text-stone-500">{breed.origin[locale]}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}