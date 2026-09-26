import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth/roles";
import { putPublicObject } from "@/lib/storage/s3";

const TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  await requireAdmin();
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  const ext = TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Use a JPEG, PNG, WebP or AVIF image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 10 MB or smaller." }, { status: 400 });
  }
  try {
    const url = await putPublicObject(
      `products/${randomUUID()}${ext}`,
      Buffer.from(await file.arrayBuffer()),
      file.type,
    );
    return NextResponse.json({ url });
  } catch (error) {
    console.error("S3 upload failed", error);
    return NextResponse.json({ error: "Upload failed. Check the S3 settings." }, { status: 502 });
  }
}
