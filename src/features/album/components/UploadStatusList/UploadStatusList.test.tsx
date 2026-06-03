/**
 * @jest-environment jsdom
 */
import { FileUpload } from '@ark-ui/react/file-upload';
import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { type FileUploadState } from '../../hooks/use-image-uploader';
import { UploadStatusList } from '.';

// jsdom は URL.createObjectURL を実装しないため、サムネイル(ItemPreviewImage)用にモックする。
beforeAll(() => {
  URL.createObjectURL = jest.fn(() => 'blob:mock') as typeof URL.createObjectURL;
  URL.revokeObjectURL = jest.fn() as typeof URL.revokeObjectURL;
});

const file = new File(['x'], 'photo.png', { type: 'image/png', lastModified: 1 });

const noop = (): void => {};

const renderList = (
  fileStates: FileUploadState[],
  onRetry: (file: File) => void = noop,
): ReturnType<typeof render> =>
  render(
    <FileUpload.Root accept="image/*" maxFiles={10} defaultAcceptedFiles={[file]}>
      <FileUpload.HiddenInput />
      <UploadStatusList fileStates={fileStates} onRetry={onRetry} />
    </FileUpload.Root>,
  );

describe('UploadStatusList', () => {
  it('shows the file name and its status badge', () => {
    renderList([{ file, status: 'uploading', error: null }]);

    expect(screen.getByText('photo.png')).toBeTruthy();
    expect(screen.getByText('アップロード中')).toBeTruthy();
  });

  it('renders a thumbnail image for the file', () => {
    const { container } = renderList([{ file, status: 'uploading', error: null }]);

    const image = container.querySelector('img');
    expect(image).not.toBeNull();
    expect(image?.getAttribute('src')).toBe('blob:mock');
  });

  it('reflects the status transition in the badge label', () => {
    const { rerender } = renderList([{ file, status: 'uploading', error: null }]);
    expect(screen.getByText('アップロード中')).toBeTruthy();

    rerender(
      <FileUpload.Root accept="image/*" maxFiles={10} defaultAcceptedFiles={[file]}>
        <FileUpload.HiddenInput />
        <UploadStatusList fileStates={[{ file, status: 'success', error: null }]} onRetry={noop} />
      </FileUpload.Root>,
    );

    expect(screen.getByText('完了')).toBeTruthy();
    expect(screen.queryByText('アップロード中')).toBeNull();
  });

  it('shows a retry button only for failed files and calls onRetry with the file', async () => {
    const onRetry = jest.fn();
    renderList([{ file, status: 'error', error: 'Upload failed with status 500.' }], onRetry);

    await userEvent.click(screen.getByRole('button', { name: '再試行' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry.mock.calls[0][0]).toBe(file);
  });

  it('does not show a retry button for non-failed files', () => {
    renderList([{ file, status: 'success', error: null }]);

    expect(screen.queryByRole('button', { name: '再試行' })).toBeNull();
  });
});
