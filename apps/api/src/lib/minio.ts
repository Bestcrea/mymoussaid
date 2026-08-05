import { Client } from "minio";
import { logger } from "./logger";

export const minioClient = new Client({
  endPoint:  process.env["MINIO_ENDPOINT"] ?? "localhost",
  port:      Number(process.env["MINIO_PORT"] ?? 9000),
  useSSL:    process.env["MINIO_USE_SSL"] === "true",
  accessKey: process.env["MINIO_ACCESS_KEY"] ?? "",
  secretKey: process.env["MINIO_SECRET_KEY"] ?? "",
});

const BUCKET = process.env["MINIO_BUCKET_DOCUMENTS"] ?? "ma-documents";

export async function ensureBucket() {
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) {
    await minioClient.makeBucket(BUCKET, "eu-west-1");
    logger.info(`Minio bucket "${BUCKET}" created`);
  }
}

export async function uploadFile(
  objectName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  await minioClient.putObject(BUCKET, objectName, buffer, buffer.length, {
    "Content-Type": contentType,
  });
  return objectName;
}

export async function getPresignedUrl(objectName: string, expiry = 3600): Promise<string> {
  return minioClient.presignedGetObject(BUCKET, objectName, expiry);
}

export async function deleteFile(objectName: string): Promise<void> {
  await minioClient.removeObject(BUCKET, objectName);
}
