import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function Footer() {
  const t = useTranslations("footer")
  const locale = useLocale()

  return (
    <footer className="border-t border-stone-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center text-sm text-stone-500 sm:text-left">
            <p>{t("copyright")}</p>
            <p className="mt-1">{t("dataSource")}</p>
          </div>

          <nav className="flex gap-6 text-sm">
            <Link href={`/${locale}/about`} className="text-stone-600 underline hover:text-stone-900">
              {t("about")}
            </Link>
            <Link href={`/${locale}/privacy`} className="text-stone-600 underline hover:text-stone-900">
              {t("privacy")}
            </Link>
            <Link href={`/${locale}/diagnose`} className="text-stone-600 underline hover:text-stone-900">
              {t("diagnosis")}
            </Link>
          </nav>

          <div className="text-center text-sm text-stone-500 sm:text-right">
            <p>{t("disclaimer")}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}