/** @type {import('next').NextConfig} */

module.exports = {
  env: {},
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
  optimizeFonts: false,
  images: {
    domains: ['youland-common-images.s3.us-west-1.amazonaws.com'],
  },
};
