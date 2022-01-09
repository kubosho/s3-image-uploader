import { getBucketHostname } from './bucket_hostname';
import { requestSignatureUrl } from './signature_url_request';

type Params = {
  imagePath: string;
  secondsToExpire?: number;
};

export async function createImageUrl({ imagePath, secondsToExpire }: Params): Promise<string> {
  const hostname = getBucketHostname();
  const url = `https://${hostname}/${imagePath}`;

  if (secondsToExpire === undefined) {
    return url;
  }

  const signatureUrl = await requestSignatureUrl({
    url,
    secondsToExpire,
  });

  return signatureUrl;
}
