/**
 * @jest-environment jsdom
 */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';

import { type FileUploadState, useImageUploader } from './use-image-uploader';

const failingNames = new Set<string>();

const createWrapper = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => createElement(QueryClientProvider, { client }, children);
};

const makeFile = (name: string): File => new File(['x'], name, { type: 'image/png', lastModified: 1 });

beforeEach(() => {
  failingNames.clear();
  global.fetch = jest.fn((input: string) => {
    const filename = new URL(input, 'http://localhost').searchParams.get('filename') ?? '';
    if (failingNames.has(filename)) {
      return Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({ message: 'fail' }) } as Response);
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ imagePath: filename }) } as Response);
  }) as unknown as typeof fetch;
});

describe('useImageUploader', () => {
  it('uploads a file and transitions it to success', async () => {
    // Arrange
    const { result } = renderHook(() => useImageUploader(), { wrapper: createWrapper() });

    // Act
    await act(async () => {
      await result.current.uploadFiles([makeFile('a.png')]);
    });

    // Assert
    expect(result.current.fileStates).toHaveLength(1);
    expect(result.current.fileStates[0].status).toBe('success');
    expect(result.current.fileStates[0].error).toBeNull();
  });

  it('keeps each file state independent when one fails', async () => {
    // Arrange
    failingNames.add('a.png');
    const { result } = renderHook(() => useImageUploader(), { wrapper: createWrapper() });

    // Act
    await act(async () => {
      await result.current.uploadFiles([makeFile('a.png'), makeFile('b.png')]);
    });

    // Assert
    const stateOf = (name: string): FileUploadState | undefined =>
      result.current.fileStates.find((state) => state.file.name === name);
    expect(stateOf('a.png')?.status).toBe('error');
    expect(stateOf('a.png')?.error).toContain('500');
    expect(stateOf('b.png')?.status).toBe('success');
  });

  it('retries a failed file and transitions it back to success', async () => {
    // Arrange: 失敗状態のファイルを用意する
    failingNames.add('a.png');
    const { result } = renderHook(() => useImageUploader(), { wrapper: createWrapper() });
    await act(async () => {
      await result.current.uploadFiles([makeFile('a.png')]);
    });
    expect(result.current.fileStates[0].status).toBe('error');
    failingNames.clear(); // 次の試行は成功させる

    // Act
    await act(async () => {
      await result.current.retryFile(result.current.fileStates[0].file);
    });

    // Assert
    expect(result.current.fileStates[0].status).toBe('success');
    expect(result.current.fileStates[0].error).toBeNull();
  });

  it('does not re-upload already tracked files (dedup)', async () => {
    // Arrange
    const { result } = renderHook(() => useImageUploader(), { wrapper: createWrapper() });

    // Act
    await act(async () => {
      await result.current.uploadFiles([makeFile('a.png')]);
    });
    await act(async () => {
      await result.current.uploadFiles([makeFile('a.png'), makeFile('b.png')]);
    });

    // Assert
    expect(result.current.fileStates).toHaveLength(2);
    // a.png はアップロード済みなので再アップロードされず、fetch は a + b の 2 回のみ。
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
