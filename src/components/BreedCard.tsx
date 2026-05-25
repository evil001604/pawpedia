import { Breed, Locale } from "@/types/breed"
import Image from "next/image"
import Link from "next/link"

export default function BreedCard({ breed, locale }: { breed: Breed; locale: Locale }) {
  const name = breed.name[locale]
  const imageUrl = breed.images[0] || ""
  const isExternal = imageUrl.startsWith("http")

  return (
    <Link
      href={`/${locale}/breeds/${breed.type}/${breed.id}`}
      className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {imageUrl ? (
          isExternal ? (
            <Image src={imageUrl} alt={name} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized />
          ) : (
            <Image src={imageUrl} alt={name} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">{breed.type === "dog" ? "Paw" : "Paw"}</div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-stone-700">
          {breed.origin[locale]}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-stone-900 group-hover:text-amber-600 transition-colors">{name}</h3>
        <div className="mt-2 flex flex-wrap gap-1">
          {breed.tags.slice(0, 3).map((t, i) => (
            <span key={i} className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
              {t[locale]}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}