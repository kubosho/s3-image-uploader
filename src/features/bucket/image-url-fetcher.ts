import { GetObjectCommand, S3ServiceException } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { objectActions } from './object-actions';
import { s3ClientInstance } from './s3-client-instance';

async function fetchObjectKeys(params: { limit: number }): Promise<string[]> {
  try {
    const response = await objectActions.readObjects({ limit: params.limit });
    return response.Contents?.flatMap((item) => (item.Key ? [item.Key] : [])) ?? [];
  } catch (error) {
    if (error instanceof S3ServiceException) {
      throw new Error(`Failed to fetch object keys: ${error.message}`);
    } else {
      throw new Error('Unexpected S3 error while fetching object keys', { cause: error });
    }
  }
}

export async function fetchImageUrls(params: { limit: number; secondsToExpire: number }): Promise<string[]> {
  try {
    const client = s3ClientInstance();
    const objectKeys = await fetchObjectKeys({ limit: params.limit });
    const urls = await Promise.all(
      objectKeys.map((key) => {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
        });

        return getSignedUrl(client, command, { expiresIn: params.secondsToExpire });
      }),
    );

    return urls;
  } catch (error) {
    console.error(error);
    return [];
  }
}
