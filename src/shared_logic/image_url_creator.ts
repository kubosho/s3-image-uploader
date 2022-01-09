import { getBucketHostname } from './s3/bucket_hostname';
import { requestSignatureUrl } from './signature_url_request';

type Params = {
  imagePath: string;
  secondsToExpire?: number;
};

export async function createImageUrl({ imagePath, secondsToExpire }: Params): Promise<string> {
  const hostname = getBucketHostname();
  const url = await requestSignatureUrl({
    url: `https://${hostname}/${imagePath}`,
    secondsToExpire,
  });

  return url;
}
