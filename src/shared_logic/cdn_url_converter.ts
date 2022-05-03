export function convertCdnUrl(imgUrl: string): string {
  const u = new URL(imgUrl);
  return `https://${process.env.AWS_CLOUD_FRONT_HOST_NAME}${u.pathname}`;
}
