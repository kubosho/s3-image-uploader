import { basename } from 'path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export async function putObject(
  client: S3Client,
  filename: string,
  body: string | ReadableStream<unknown> | Blob | Uint8Array | Buffer,
): Promise<unknown> {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: basename(filename),
    Body: body,
  });

  try {
    const data = await client.send(command);
    return data;
  } catch (err) {
    console.error(err);
  }
}
