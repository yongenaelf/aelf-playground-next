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
        source: "/api/playground/audit/:path*",
        destination: `https://playground-next.test.aelf.dev/api/playground/audit/:path*`,
      },
      {
        source: "/api/playground/report/:path*",
        destination: `https://playground-next.test.aelf.dev/api/playground/report/:path*`,
      },
    ];
  };
}

export default nextConfig;
