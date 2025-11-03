# S3 image uploader

Image uploader for AWS S3.

## Requirements

- Deno

## Setup

### Environment Variables

To develop locally, create a `.env` file by copying `.env.template`:

```bash
cp .env.template .env
```

Then update each environment variable with your AWS credentials and configuration:

```bash
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_S3_HOST_NAME=s3.amazonaws.com
AWS_S3_REGION_NAME=ap-northeast-1
AWS_CLOUD_FRONT_HOST_NAME=example.cloudfront.net
```

## Development

Launch development server:

```bash
deno task dev
```

Execute build:

```bash
deno task build
```

Run lint:

```bash
deno task lint
```

Run test runner:

```bash
deno task test
```

Launch storybook:

```bash
deno task storybook
```
