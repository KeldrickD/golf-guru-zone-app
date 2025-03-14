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
    domains: ['ipfs.io', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  // Configure dynamic routes
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'golf-guru-zone.vercel.app'],
    },
    serverComponentsExternalPackages: ['@prisma/client'],
  }
}

module.exports = nextConfig 