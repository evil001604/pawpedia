import { Breed, Locale } from "@/types/breed"

const dogProducts = [
  { key: "bowl", tags: ["all"] }, { key: "leash", tags: ["all"] }, { key: "bed", tags: ["all"] },
  { key: "crate", tags: ["working", "herding", "hound"] }, { key: "toy", tags: ["all"] },
  { key: "grooming", tags: ["long coat", "double coat", "wire"] }, { key: "food", tags: ["all"] },
]

const catProducts = [
  { key: "bowl", tags: ["all"] }, { key: "scratch", tags: ["all"] }, { key: "bed", tags: ["all"] },
  { key: "toy", tags: ["all"] }, { key: "grooming", tags: ["all"] }, { key: "food", tags: ["all"] },
]

const productLabels: Record<string, Record<Locale, string>> = {
  bowl: { en: "Premium Food Bowl", zh: "优质食盆" }, leash: { en: "Durable Leash Set", zh: "耐用牵引绳套装" },
  bed: { en: "Comfort Pet Bed", zh: "舒适宠物床" }, crate: { en: "Training Crate", zh: "训练笼" },
  toy: { en: "Interactive Toy", zh: "互动玩具" }, grooming: { en: "Grooming Kit", zh: "美容套装" },
  food: { en: "Premium Pet Food", zh: "优质宠物粮" }, scratch: { en: "Scratching Post", zh: "猫抓板" },
}

const productPrices: Record<string, { en: string; zh: string }> = {
  bowl: { en: "$12.99", zh: " 89" }, leash: { en: "$19.99", zh: " 139" },
  bed: { en: "$34.99", zh: " 249" }, crate: { en: "$49.99", zh: " 349" },
  toy: { en: "$9.99", zh: " 69" }, grooming: { en: "$24.99", zh: " 179" },
  food: { en: "$29.99", zh: " 209" }, scratch: { en: "$15.99", zh: " 109" },
}

export default function ProductRecommend({ breed, locale, forLabel }: { breed: Breed; locale: Locale; forLabel: string }) {
  const products = breed.type === "dog" ? dogProducts : catProducts

  const relevant = products.filter((p) => {
    if (p.tags.includes("all")) return true
    const breedTagsLower = breed.tags.map((t) => t.en.toLowerCase())
    return p.tags.some((tag) => breedTagsLower.some((bt) => bt.includes(tag.toLowerCase())))
  })

  if (relevant.length === 0) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {relevant.map((product) => (
        <div key={product.key} className="rounded-xl border border-stone-200 bg-white p-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-3xl">
            Paw
          </div>
          <p className="mt-3 text-sm font-medium text-stone-800">{productLabels[product.key]?.[locale] || product.key}</p>
          <p className="mt-1 text-xs text-stone-500">{forLabel}</p>
          <p className="mt-2 text-lg font-bold text-amber-600">{productPrices[product.key]?.[locale]}</p>
        </div>
      ))}
    </div>
  )
}