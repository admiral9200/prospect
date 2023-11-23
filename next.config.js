/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["media.licdn.com"],
  },

  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
