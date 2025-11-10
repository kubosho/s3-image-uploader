import { S3Client } from '@aws-sdk/client-s3';

import { getAwsEnv } from './aws-env';

let instance: S3Client | null = null;
export const s3ClientInstance = (): S3Client => {
  if (instance == null) {
    const { AWS_S3_REGION_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = getAwsEnv();

    instance = new S3Client({
      region: AWS_S3_REGION_NAME,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  return instance;
};
