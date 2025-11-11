import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { s3ClientInstance } from './s3-client-instance';

export function getObjectPresignedUrl({
  filename,
  expiresIn,
}: {
  filename: string;
  expiresIn: number;
}): Promise<string> {
  const client = s3ClientInstance();
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: filename,
  });

  return getSignedUrl(client, command, { expiresIn });
}
