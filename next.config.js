# Create next.config.js
@"
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  webpack: (config, { isServer }) => {
    // Ignore desktop app
    config.resolve.alias = {
      ...config.resolve.alias,
      '@desktop': false
    };
    return config;
  }
};

module.exports = nextConfig;
"@ > next.config.js

# Push to GitHub
git add next.config.js
git commit -m "Add Next.js config to ignore desktop app"
git push