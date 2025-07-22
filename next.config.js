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
  async redirects() {
    return [
      {
        source: '/file-portal',
        destination: '/doc-portal',
        permanent: true,
      },
      {
        source: '/file-portal/:path*',
        destination: '/doc-portal/:path*',
        permanent: true,
      },
    ];
  },
};
