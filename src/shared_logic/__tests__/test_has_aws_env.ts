import { hasAwsEnv } from '../has_aws_env';

test('hasAwsEnv(): Returns true if all AWS environment variables are exists.', () => {
  const actual = hasAwsEnv({
    NODE_ENV: 'test',
    AWS_ACCESS_KEY_ID: 'AWS_ACCESS_KEY_ID',
    AWS_SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
    AWS_S3_BUCKET_NAME: 'AWS_S3_BUCKET_NAME',
    AWS_S3_HOST_NAME: 'AWS_S3_HOST_NAME',
    AWS_S3_REGION_NAME: 'AWS_S3_REGION_NAME',
  });
  const expected = true;

  expect(actual).toBe(expected);
});

test('hasAwsEnv(): Returns false if all AWS environment variables are not exists.', () => {
  const actual = hasAwsEnv({
    NODE_ENV: 'test',
    AWS_ACCESS_KEY_ID: 'AWS_ACCESS_KEY_ID',
    AWS_SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
    AWS_S3_BUCKET_NAME: 'AWS_S3_BUCKET_NAME',
    AWS_S3_HOST_NAME: 'AWS_S3_HOST_NAME',
  });
  const expected = false;

  expect(actual).toBe(expected);
});
