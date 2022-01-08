import { bucketHostname } from '@aws-sdk/middleware-bucket-endpoint';
import { requestSignatureUrl } from './signature_url_request';

type Params = {
  imagePath: string;
  secondsToExpire?: number;
};

export async function createImageUrl({ imagePath, secondsToExpire }: Params): Promise<string> {
  const { hostname } = bucketHostname({
    baseHostname: process.env.AWS_S3_HOST_NAME,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    clientRegion: process.env.AWS_S3_REGION_NAME,
    isCustomEndpoint: false,
  });

  const url = await requestSignatureUrl({
    url: `https://${hostname}/${imagePath}`,
    secondsToExpire,
  });
  return url;
}
