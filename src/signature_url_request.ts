import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { Hash } from "@aws-sdk/hash-node";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { parseUrl } from "@aws-sdk/url-parser";

type Params = {
  url: string;
  secondsToExpire?: number;
};

export async function requestSignatureUrl({
  url,
  secondsToExpire,
}: Params): Promise<string> {
  const hash = Hash.bind(null, "sha256");

  const presigner = new S3RequestPresigner({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_S3_REGION_NAME,
    sha256: hash,
  });

  const expiresIn = secondsToExpire ?? 600;
  const { hostname, path, protocol, query } = await presigner.presign(
    new HttpRequest(parseUrl(url)),
    { expiresIn }
  );
  const urlSearchParams = new URLSearchParams(query as Record<string, string>);
  const urlSearchParamString = urlSearchParams.toString();

  return `${protocol}//${hostname}${path}?${urlSearchParamString}`;
}
