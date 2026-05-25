import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn2.thedogapi.com" },
      { protocol: "https", hostname: "cdn4.thedogapi.com" },
      { protocol: "https", hostname: "cdn2.thecatapi.com" },
    ],
  },
  trailingSlash: false,
}

export default withNextIntl(nextConfig)