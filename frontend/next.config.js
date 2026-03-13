/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Expose backend URL to client
  env: {
    NEXT_PUBLIC_API_URL: "https://backend.tracit.io",
  },

  // For reverse proxy and self-signed DSM certificates
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  }
};

module.exports = nextConfig;
