import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { minioClient, MINIO_BUCKET } from "@/lib/minio";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "png";
    const objectName = `${randomUUID()}.${ext}`;

    // Ensure bucket exists
    const bucketExists = await minioClient.bucketExists(MINIO_BUCKET);
    if (!bucketExists) {
      await minioClient.makeBucket(MINIO_BUCKET);
    }

    await minioClient.putObject(MINIO_BUCKET, objectName, buffer, buffer.length, {
      "Content-Type": file.type,
    });

    const protocol = process.env.MINIO_USE_SSL === "true" ? "https" : "http";
    const port = process.env.MINIO_PORT || "9000";
    const endpoint = process.env.MINIO_ENDPOINT;
    const url = `${protocol}://${endpoint}:${port}/${MINIO_BUCKET}/${objectName}`;

    return NextResponse.json({ url });
  } catch (err) {
    console.log("[UPLOAD_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
