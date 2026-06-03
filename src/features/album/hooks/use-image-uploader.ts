'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';

import { ImageUploadStatus } from '../types/image-upload-status';
import { imagesQueryKey } from '../utils/images-query-key';
import { upsertImagesSuccessResponseSchema } from '../utils/upsert-images-schema';

export type FileUploadState = {
  id: string;
  file: File;
  status: ImageUploadStatus;
  error: string | null;
};

type UseImageUploaderResult = {
  fileStates: FileUploadState[];
  uploadFiles: (files: File[]) => Promise<void>;
  retryFile: (id: string, file: File) => Promise<void>;
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
  // アップロードのたびに採番する一意な ID。同一ファイルの再アップロードでも別エントリになり、
  // 表示の key 衝突を防ぐ。ImageUploader が accept ごとに ark-ui をクリアするため、
  // 受け取るファイルは常に新規の選択分だけで、キーによる重複排除は不要。
  const nextIdRef = useRef(0);
  const queryClient = useQueryClient();

  const setStatus = useCallback((id: string, status: ImageUploadStatus, error: string | null = null) => {
    setFileStates((prev) => prev.map((state) => (state.id === id ? { ...state, status, error } : state)));
  }, []);

  const runUpload = useCallback(
    async (id: string, file: File) => {
      setStatus(id, 'uploading');

      try {
        await uploadSingleImage(file);
        setStatus(id, 'success');
        void queryClient.invalidateQueries({ queryKey: imagesQueryKey });
      } catch (error) {
        setStatus(id, 'error', error instanceof Error ? error.message : 'Unknown error');
      }
    },
    [queryClient, setStatus],
  );

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) {
        return;
      }

      const entries = files.map((file) => ({ id: String(nextIdRef.current++), file }));
      setFileStates((prev) => [...prev, ...entries.map(({ id, file }) => ({ id, file, status: 'queued' as const, error: null }))]);

      // allSettled: 一件の失敗で残りのアップロードをキャンセルさせない。
      await Promise.allSettled(entries.map(({ id, file }) => runUpload(id, file)));
    },
    [runUpload],
  );

  const retryFile = useCallback(
    async (id: string, file: File) => {
      setStatus(id, 'queued');
      await runUpload(id, file);
    },
    [runUpload, setStatus],
  );

  return { fileStates, uploadFiles, retryFile };
};
