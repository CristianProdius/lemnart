/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: process.env.MINIO_USE_SSL === "true" ? "https" : "http",
                hostname: process.env.MINIO_ENDPOINT || "localhost",
            },
        ],
    },
}

module.exports = nextConfig
