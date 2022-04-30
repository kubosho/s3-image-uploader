import { AWS_ENV } from '../constants/aws_env';

export function hasAwsEnv(env: NodeJS.ProcessEnv): boolean {
  const processEnvKeyList = Object.keys(env);
  const awsEnvKeyList = Object.keys(AWS_ENV);

  return awsEnvKeyList.every((awsEnvKey) => processEnvKeyList.find((processEnvKey) => awsEnvKey === processEnvKey));
}
