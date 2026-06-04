import createNextIntlPlugin from "next-intl/plugin"
import type { NextConfig } from "next"

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/w40/**",
      },
      {
        protocol: "https",
        hostname: "img.logo.dev",
      },
    ],
  },
}

export default withNextIntl(nextConfig)
