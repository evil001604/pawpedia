import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://pawpedia.xyz"),
  title: { default: "PetPedia — AI Pet Breed Encyclopedia", template: "%s | PetPedia" },
  description: "Explore 266+ dog and cat breeds with radar charts, health guides, AI diagnosis, and product picks. Bilingual EN/ZH.",
  openGraph: {
    title: "PetPedia — AI Pet Breed Encyclopedia",
    description: "Explore 266+ dog and cat breeds with radar charts, health guides, and AI diagnosis.",
    siteName: "PetPedia",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PetPedia — AI Pet Breed Encyclopedia",
    description: "Explore 266+ dog and cat breeds with radar charts, health guides, and AI diagnosis.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
    languages: { en: "/en", zh: "/zh" },
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PetPedia",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://pawpedia.xyz",
    "description": "Explore 266+ dog and cat breeds with radar charts, health guides, AI diagnosis, and product picks. Bilingual EN/ZH.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": (process.env.NEXT_PUBLIC_BASE_URL || "https://pawpedia.xyz") + "/en/breeds/dog?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8406737735428048"
          crossOrigin="anonymous"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0J0C8KXZJJ" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-0J0C8KXZJJ');`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(vxrr){var d=document,s=d.createElement('script'),l=d.scripts[d.scripts.length-1];s.settings=vxrr||{};s.src="//profitable-grocery.com/bHX/V.s-drG/lM0NYCWLcB/oeDmw9/uKZzU/lekyPxTtcWwcOzDpAr0/OWDGkytVNzzNA/4ZMTDJQO5sMzwc";s.async=true;s.referrerPolicy='no-referrer-when-downgrade';l.parentNode.insertBefore(s,l);})({})`,
          }}
        />
        </head>
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">{children}</body>
    </html>
  )
}