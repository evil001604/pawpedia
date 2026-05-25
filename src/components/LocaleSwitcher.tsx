"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"

export default function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const toggleLocale = () => {
    const next = locale === "en" ? "zh" : "en"
    const newPath = pathname.replace(`/${locale}`, `/${next}`)
    startTransition(() => router.replace(newPath))
  }

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-stone-100 disabled:opacity-50"
    >
      {locale === "en" ? "中文" : "EN"}
    </button>
  )
}