/** @type {import('next').NextConfig} */

module.exports = {
  env: {
    USER_POOL_ID: process.env.USER_POOL_ID,
    CLIENT_ID: process.env.CLIENT_ID,
    STRIPE_PUBLISH_KEY: process.env.STRIPE_PUBLISH_KEY,
  },
  reactStrictMode: false,
  trailingSlash: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
