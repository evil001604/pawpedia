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
  },
  robots: "index, follow",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
      </head>
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">{children}</body>
    </html>
  )
}