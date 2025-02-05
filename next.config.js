/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [
      'static.toiimg.com',
      'encrypted-tbn0.gstatic.com',
      'lh3.googleusercontent.com',
      'images.unsplash.com',
    ],
  },
}

module.exports = nextConfig 