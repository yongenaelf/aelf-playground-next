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

if (process.env.NODE_ENV === "development") {
  nextConfig.rewrites = async () => {
    return [
      {
        source: "/api/audit/:path*",
        destination: `https://playground-next.test.aelf.dev/api/audit/:path*`,
      },
    ];
  };
}

export default nextConfig;
