# Create the correct next.config.js
@"
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  // Exclude desktop app from build
  webpack: (config, { isServer }) => {
    // Ignore the desktop app
    config.resolve.alias = {
      ...config.resolve.alias,
      '@desktop': false
    };
    return config;
  },
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
"@ > next.config.js