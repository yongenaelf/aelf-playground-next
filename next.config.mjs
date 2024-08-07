/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mdx$/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
