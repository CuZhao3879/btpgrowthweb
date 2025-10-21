/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true, // For static export
  },
  // Uncomment below for static export (DigitalOcean)
  // output: 'export',
}

module.exports = nextConfig

