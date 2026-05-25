'use client'

import { useTranslations } from 'next-intl'

export default function PrivacyContent() {
  const t = useTranslations('privacy')

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-4 text-4xl font-bold text-stone-900">{t('title')}</h1>
        <p className="mb-12 text-sm text-stone-500">{t('lastUpdated')}</p>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold text-stone-800">{t('overview.title')}</h2>
          <p className="leading-relaxed text-stone-600">{t('overview.content')}</p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold text-stone-800">{t('dataCollection.title')}</h2>
          <p className="leading-relaxed text-stone-600">{t('dataCollection.content')}</p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold text-stone-800">{t('cookies.title')}</h2>
          <p className="leading-relaxed text-stone-600">{t('cookies.content')}</p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold text-stone-800">{t('thirdParty.title')}</h2>
          <p className="leading-relaxed text-stone-600">{t('thirdParty.content')}</p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold text-stone-800">{t('contact.title')}</h2>
          <p className="leading-relaxed text-stone-600">
            {t('contact.content')}{' '}
            <a href="mailto:xiaojuntang80@gmail.com" className="text-blue-600 underline hover:text-blue-800">
              xiaojuntang80@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}