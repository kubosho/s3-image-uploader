import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3';

export async function fetchObjectKeys(client: S3Client): Promise<string[]> {
  const command = new ListObjectsCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
  });

  try {
    const response = await client.send(command);
    const keys = response.Contents.map((content) => content.Key);
    return keys;
  } catch (err) {
    console.error(err);
  }
}
