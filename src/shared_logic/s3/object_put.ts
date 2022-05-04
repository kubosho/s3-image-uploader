import { PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';

type Params = {
  client: S3Client;
  filename: string;
  body: Uint8Array;
};

export async function putObject({ client, filename, body }: Params): Promise<PutObjectCommandOutput> {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: filename,
    Body: body,
  });

  try {
    const data = await client.send(command);
    return data;
  } catch (err) {
    console.error(err);
  }
}
