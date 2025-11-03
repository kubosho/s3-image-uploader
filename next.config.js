module.exports = {
  env: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    AWS_S3_HOST_NAME: process.env.AWS_S3_HOST_NAME,
    AWS_S3_REGION_NAME: process.env.AWS_S3_REGION_NAME,
    AWS_CLOUD_FRONT_HOST_NAME: process.env.AWS_CLOUD_FRONT_HOST_NAME,
  },
  images: {
    remotePatterns: [new URL(`https://${process.env.AWS_S3_BUCKET_NAME}.${process.env.AWS_S3_HOST_NAME}/**`)],
  }
};
