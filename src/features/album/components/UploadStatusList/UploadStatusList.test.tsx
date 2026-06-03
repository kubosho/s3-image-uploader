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
    // Arrange & Act
    renderList([{ file, status: 'uploading', error: null }]);

    // Assert
    expect(screen.getByText('photo.png')).toBeTruthy();
    expect(screen.getByText('アップロード中')).toBeTruthy();
  });

  it('renders a thumbnail image for the file', () => {
    // Arrange & Act
    const { container } = renderList([{ file, status: 'uploading', error: null }]);

    // Assert
    const image = container.querySelector('img');
    expect(image).not.toBeNull();
    expect(image?.getAttribute('src')).toBe('blob:mock');
  });

  it('reflects the status transition in the badge label', () => {
    // Arrange
    const { rerender } = renderList([{ file, status: 'uploading', error: null }]);
    expect(screen.getByText('アップロード中')).toBeTruthy();

    // Act: 状態を success に更新して再レンダリングする
    rerender(
      <FileUpload.Root accept="image/*" maxFiles={10} defaultAcceptedFiles={[file]}>
        <FileUpload.HiddenInput />
        <UploadStatusList fileStates={[{ file, status: 'success', error: null }]} onRetry={noop} />
      </FileUpload.Root>,
    );

    // Assert
    expect(screen.getByText('完了')).toBeTruthy();
    expect(screen.queryByText('アップロード中')).toBeNull();
  });

  it('shows a retry button only for failed files and calls onRetry with the file', async () => {
    // Arrange
    const onRetry = jest.fn();
    renderList([{ file, status: 'error', error: 'Upload failed with status 500.' }], onRetry);

    // Act
    await userEvent.click(screen.getByRole('button', { name: '再試行' }));

    // Assert
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry.mock.calls[0][0]).toBe(file);
  });

  it('does not show a retry button for non-failed files', () => {
    // Arrange & Act
    renderList([{ file, status: 'success', error: null }]);

    // Assert
    expect(screen.queryByRole('button', { name: '再試行' })).toBeNull();
  });
});
