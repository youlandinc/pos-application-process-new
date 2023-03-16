/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: false,
  trailingSlash: true,
  // i18n: {
  //   locales: ['zh', 'en'],
  //   defaultLocale: 'en',
  //   localeDetection: false,
  //   domains: [
  //     {
  //       domain: 'example.zh',
  //       defaultLocale: 'zh',
  //     },
  //     {
  //       domain: 'example.com',
  //       defaultLocale: 'en',
  //     },
  //   ],
  // },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  // exportPathMap: async function (
  //   defaultPathMap,
  //   { dev, dir, outDir, distDir, buildId },
  // ) {
  //   return {
  //     '/': { page: '/' },
  //   };
  // },
};
