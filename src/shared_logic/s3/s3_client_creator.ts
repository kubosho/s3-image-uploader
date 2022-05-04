import { S3Client } from '@aws-sdk/client-s3';

const createS3Client = (): S3Client =>
  new S3Client({
    region: process.env.AWS_S3_REGION_NAME,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

let instance = null;
export const s3ClientInstance = () => {
  if (instance === null) {
    instance = createS3Client();
  }

  return instance;
};
