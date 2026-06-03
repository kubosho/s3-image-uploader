'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';

import { ImageUploadStatus } from '../types/image-upload-status';
import { fileKey } from '../utils/file-key';
import { imagesQueryKey } from '../utils/images-query-key';
import { upsertImagesSuccessResponseSchema } from '../utils/upsert-images-schema';

export type FileUploadState = {
  file: File;
  status: ImageUploadStatus;
  error: string | null;
};

type UseImageUploaderResult = {
  fileStates: FileUploadState[];
  uploadFiles: (files: File[]) => Promise<void>;
  retryFile: (file: File) => Promise<void>;
};

const uploadSingleImage = async (file: File): Promise<void> => {
  const params = new URLSearchParams();
  // Not using append() to prevent multiple parameters added.
  params.set('filename', file.name);

  const response = await fetch(`/api/images/upload?${params.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });
  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}.`);
  }

  const result = upsertImagesSuccessResponseSchema.safeParse(await response.json());
  if (!result.success) {
    throw new Error('Invalid response type from server.');
  }
};

export const useImageUploader = (): UseImageUploaderResult => {
  const [fileStates, setFileStates] = useState<FileUploadState[]>([]);
  // dedup: ark-ui は acceptedFiles に累積追記し onFileAccept で累積全体を渡すため、
  // 追跡済みキーを保持し未追跡の新規ファイルだけアップロードして再アップロードを防ぐ。
  const trackedKeysRef = useRef<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const setStatus = useCallback((file: File, status: ImageUploadStatus, error: string | null = null) => {
    const key = fileKey(file);
    setFileStates((prev) => prev.map((state) => (fileKey(state.file) === key ? { ...state, status, error } : state)));
  }, []);

  const runUpload = useCallback(
    async (file: File) => {
      setStatus(file, 'uploading');

      try {
        await uploadSingleImage(file);
        setStatus(file, 'success');
        void queryClient.invalidateQueries({ queryKey: imagesQueryKey });
      } catch (error) {
        setStatus(file, 'error', error instanceof Error ? error.message : 'Unknown error');
      }
    },
    [queryClient, setStatus],
  );

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const newFiles = files.filter((file) => !trackedKeysRef.current.has(fileKey(file)));
      if (newFiles.length === 0) {
        return;
      }

      newFiles.forEach((file) => trackedKeysRef.current.add(fileKey(file)));
      setFileStates((prev) => [...prev, ...newFiles.map((file) => ({ file, status: 'queued' as const, error: null }))]);

      // allSettled: 一件の失敗で残りのアップロードをキャンセルさせない。
      await Promise.allSettled(newFiles.map(runUpload));
    },
    [runUpload],
  );

  const retryFile = useCallback(
    async (file: File) => {
      setStatus(file, 'queued');
      await runUpload(file);
    },
    [runUpload, setStatus],
  );

  return { fileStates, uploadFiles, retryFile };
};
