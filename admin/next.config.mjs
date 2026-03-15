/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.MINIO_USE_SSL === "true" ? "https" : "http",
        hostname: process.env.MINIO_ENDPOINT || "localhost",
      },
    ],
  },
};

export default nextConfig;
