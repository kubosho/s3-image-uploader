import { S3Client } from '@aws-sdk/client-s3';

export const createS3Client = () =>
  new S3Client({
    region: process.env.AWS_S3_REGION_NAME,
  });
