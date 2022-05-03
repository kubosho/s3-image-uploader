import { basename } from 'path';
import { DeleteObjectCommand, DeleteObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';

type Params = {
  client: S3Client;
  filename: string;
};

export async function deleteObject({ client, filename }: Params): Promise<DeleteObjectCommandOutput> {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: basename(filename),
  });

  try {
    const data = await client.send(command);
    return data;
  } catch (err) {
    console.error(err);
  }
}
