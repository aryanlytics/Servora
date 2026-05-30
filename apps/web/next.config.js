/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@servora/shared-types", "@servora/shared-utils"],
  reactStrictMode: true,
};

module.exports = nextConfig;
