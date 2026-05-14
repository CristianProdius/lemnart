import * as Minio from "minio";

let _minioClient: Minio.Client | null = null;

export function getMinioClient(): Minio.Client {
  if (!_minioClient) {
    _minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT!,
      port: Number(process.env.MINIO_PORT) || 9000,
      useSSL: process.env.MINIO_USE_SSL === "true",
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!,
    });
  }
  return _minioClient;
}

/** @deprecated Use getMinioClient() instead */
export const minioClient = null as unknown as Minio.Client;

export const MINIO_BUCKET = process.env.MINIO_BUCKET || "uploads";
