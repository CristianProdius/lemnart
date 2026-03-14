/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: process.env.MINIO_USE_SSL === "true" ? "https" : "http",
                hostname: process.env.NEXT_PUBLIC_MINIO_HOSTNAME || "localhost",
            },
        ],
    },
}

module.exports = nextConfig
