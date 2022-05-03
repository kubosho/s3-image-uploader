import { convertCdnUrl } from '../cdn_url_converter';

test('convertCdnUrl(): Hostname in image URL is hostname of CDN.', () => {
  const imagePath = 'example.jpg';

  const actual = convertCdnUrl(
    `https://subdomain.s3.amazonaws.com/${imagePath}?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256`,
  );
  const expected = `https://${process.env.AWS_CLOUD_FRONT_HOST_NAME}/${imagePath}`;

  expect(actual).toBe(expected);
});
