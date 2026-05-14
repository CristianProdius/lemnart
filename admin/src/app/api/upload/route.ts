import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMinioClient, MINIO_BUCKET } from "@/lib/minio";
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
    const bucketExists = await getMinioClient().bucketExists(MINIO_BUCKET);
    if (!bucketExists) {
      await getMinioClient().makeBucket(MINIO_BUCKET);
    }

    await getMinioClient().putObject(MINIO_BUCKET, objectName, buffer, buffer.length, {
      "Content-Type": file.type,
    });

    const publicUrl = process.env.MINIO_PUBLIC_URL || "https://minio.lemnartdecor.md";
    const url = `${publicUrl}/${MINIO_BUCKET}/${objectName}`;

    return NextResponse.json({ url });
  } catch (err) {
    console.log("[UPLOAD_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
