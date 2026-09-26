import "server-only";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

let client: S3Client | null = null;

function s3(): S3Client {
  client ??= new S3Client({
    region: env("AWS_REGION"),
    credentials: {
      accessKeyId: env("AWS_ACCESS_KEY_ID"),
      secretAccessKey: env("AWS_SECRET_ACCESS_KEY"),
    },
  });
  return client;
}

/** Uploads a public-read object and returns its bucket URL. */
export async function putPublicObject(key: string, body: Buffer, contentType: string): Promise<string> {
  const bucket = env("AWS_S3_BUCKET_NAME");
  const region = env("AWS_REGION");
  await s3().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}
