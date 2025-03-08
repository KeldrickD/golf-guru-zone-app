/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure webpack for compatibility with ethers.js
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['ipfs.io'],
  },
  // Configure dynamic routes
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'golf-guru-zone.vercel.app'],
    },
  }
}

module.exports = nextConfig 