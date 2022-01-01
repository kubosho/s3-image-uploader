import { createImageUrl } from "./image_url_creator";
import { createS3Client } from "./s3_client_creator";
import { fetchObjectKeys } from "./object_keys_fetcher";

type Params = {
  secondsToExpire?: number;
};

export async function getImageUrls({
  secondsToExpire,
}: Params): Promise<string[]> {
  require("dotenv").config();

  const s3Client = createS3Client();
  const objectKeys = await fetchObjectKeys(s3Client);
  const urls = await Promise.all(
    objectKeys.map(
      async (key) => await createImageUrl({ imagePath: key, secondsToExpire })
    )
  );
  return urls;
}
