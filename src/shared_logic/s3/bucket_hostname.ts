import { bucketHostname } from '@aws-sdk/middleware-bucket-endpoint';

export function getBucketHostname(): string {
  const { hostname } = bucketHostname({
    baseHostname: process.env.AWS_S3_HOST_NAME,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    clientRegion: process.env.AWS_S3_REGION_NAME,
    isCustomEndpoint: false,
  });

  return hostname;
}
