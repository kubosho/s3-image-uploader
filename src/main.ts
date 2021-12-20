import { createS3Client } from "./s3_client_creator";
import { fetchObjectKeys } from "./object_keys_fetcher";

async function main() {
  require("dotenv").config();

  const s3Client = createS3Client();

  await fetchObjectKeys(s3Client);
}

main();
