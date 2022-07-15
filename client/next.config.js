/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    // Following configuration makes it possible to use SVGs as React components. Webpack will in the build process turn every SVG into
    // a React component when the URL ends with ?inline like so: import Star from '../assets/icons/star.svg?inline'.
    config.module.rules.push(
      {
        test: /\.svg$/i,
        type: 'asset',
        resourceQuery: { not: [/inline/] },
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: /inline/,
        use: ['@svgr/webpack'],
      }
    );

    return config;
  },
};

module.exports = nextConfig;
