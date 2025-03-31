/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure webpack for compatibility
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  // Set build output to standalone to support Vercel deployment
  output: 'standalone',
  // Don't clean the .next directory between builds to preserve service worker
  experimental: {
    // This prevents certain pages from being statically generated
    excludeDefaultMomentLocales: false,
  },
  images: {
    unoptimized: true,
  },
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 