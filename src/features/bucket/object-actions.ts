import {
  DeleteObjectCommand,
  type DeleteObjectCommandOutput,
  GetObjectCommand,
  type GetObjectCommandOutput,
  PutObjectCommand,
  type PutObjectCommandOutput,
  S3ServiceException,
} from '@aws-sdk/client-s3';

import { s3ClientInstance } from './s3-client-instance';

interface ObjectActions {
  upsertObject: (params: { filename: string; body: Uint8Array }) => Promise<PutObjectCommandOutput>;
  readObject: (params: { filename: string }) => Promise<GetObjectCommandOutput>;
  deleteObject: (params: { filename: string }) => Promise<DeleteObjectCommandOutput>;
}

class S3ObjectActions implements ObjectActions {
  async upsertObject(params: { filename: string; body: Uint8Array }): Promise<PutObjectCommandOutput> {
    const { filename, body } = params;
    const client = s3ClientInstance();

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
      Body: body,
    });

    try {
      const data = await client.send(command);
      return data;
    } catch (error) {
      if (error instanceof S3ServiceException) {
        console.error('putObject failed', { key: filename, code: error.name, message: error.message });
        throw error;
      }

      throw new Error('Unexpected S3 failure', { cause: error });
    }
  }

  async readObject(params: { filename: string }): Promise<GetObjectCommandOutput> {
    const { filename } = params;
    const client = s3ClientInstance();

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
    });

    try {
      const data = await client.send(command);
      return data;
    } catch (error) {
      if (error instanceof S3ServiceException) {
        console.error('getObject failed', { key: filename, code: error.name, message: error.message });
        throw error;
      }

      throw new Error('Unexpected S3 failure', { cause: error });
    }
  }

  async deleteObject(params: { filename: string }): Promise<DeleteObjectCommandOutput> {
    const { filename } = params;
    const client = s3ClientInstance();

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
    });

    try {
      const data = await client.send(command);
      return data;
    } catch (error) {
      if (error instanceof S3ServiceException) {
        console.error('deleteObject failed', { key: filename, code: error.name, message: error.message });
        throw error;
      }

      throw new Error('Unexpected S3 failure', { cause: error });
    }
  }
}

export const objectActions: ObjectActions = new S3ObjectActions();
