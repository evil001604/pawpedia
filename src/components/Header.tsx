import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import LocaleSwitcher from "./LocaleSwitcher"

export default function Header() {
  const t = useTranslations("nav")
  const locale = useLocale()

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-xl font-bold text-amber-600">
          <span className="text-2xl">Paw</span>
          <span className="hidden sm:inline">PetPedia</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-4">
          <Link href={`/${locale}`} className="rounded-lg px-3 py-2 hover:bg-stone-100">{t("home")}</Link>
          <Link href={`/${locale}/breeds/dog`} className="rounded-lg px-3 py-2 hover:bg-stone-100">{t("dogs")}</Link>
          <Link href={`/${locale}/breeds/cat`} className="rounded-lg px-3 py-2 hover:bg-stone-100">{t("cats")}</Link>
          <Link href={`/${locale}/compare`} className="rounded-lg px-3 py-2 hover:bg-stone-100">{t("compare")}</Link>
          <Link href={`/${locale}/quiz`} className="rounded-lg px-3 py-2 hover:bg-stone-100">{t("quiz")}</Link>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  )
}