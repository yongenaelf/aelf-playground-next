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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
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
