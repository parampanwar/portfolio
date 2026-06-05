/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  // Suppress hydration warnings for browser extensions
  experimental: {
    scrollRestoration: true,
  },
  async rewrites() {
    return [
      {
        source: "/auth/me",
        destination: "/api/auth/me",
      },
      {
        source: "/auth/login",
        destination: "/api/auth/login",
      },
      {
        source: "/resume",
        destination: "/api/resume",
      },
    ];
  },
};

module.exports = nextConfig;
