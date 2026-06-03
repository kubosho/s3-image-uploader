/**
 * @jest-environment jsdom
 */
import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { type FileUploadState } from '../../hooks/use-image-uploader';
import { UploadStatusList } from '.';

// jsdom は URL.createObjectURL を実装しないため、サムネイル用にモックする。
beforeAll(() => {
  URL.createObjectURL = jest.fn(() => 'blob:mock') as typeof URL.createObjectURL;
  URL.revokeObjectURL = jest.fn() as typeof URL.revokeObjectURL;
});

const file = new File(['x'], 'photo.png', { type: 'image/png', lastModified: 1 });

const noop = (): void => {};

const renderList = (
  fileStates: FileUploadState[],
  onRetry: (id: string, file: File) => void = noop,
): ReturnType<typeof render> => render(<UploadStatusList fileStates={fileStates} onRetry={onRetry} />);

describe('UploadStatusList', () => {
  it('shows the file name and its status badge', () => {
    // Arrange & Act
    renderList([{ id: '1', file, status: 'uploading', error: null }]);

    // Assert: 見つからなければ getByText が throw する
    screen.getByText('photo.png');
    screen.getByText('アップロード中');
  });

  it('renders a thumbnail image for the file', () => {
    // Arrange & Act
    const { container } = renderList([{ id: '1', file, status: 'uploading', error: null }]);

    // Assert
    const image = container.querySelector('img');
    expect(image).not.toBeNull();
    expect(image?.getAttribute('src')).toBe('blob:mock');
  });

  it('reflects the status transition in the badge label', () => {
    // Arrange
    const { rerender } = renderList([{ id: '1', file, status: 'uploading', error: null }]);
    screen.getByText('アップロード中');

    // Act: 状態を success に更新して再レンダリングする
    rerender(<UploadStatusList fileStates={[{ id: '1', file, status: 'success', error: null }]} onRetry={noop} />);

    // Assert
    screen.getByText('完了');
    expect(screen.queryByText('アップロード中')).toBeNull();
  });

  it('shows a retry button only for failed files and calls onRetry with the id and file', async () => {
    // Arrange
    const onRetry = jest.fn();
    renderList([{ id: '7', file, status: 'error', error: 'Upload failed with status 500.' }], onRetry);

    // Act
    await userEvent.click(screen.getByRole('button', { name: '再試行' }));

    // Assert
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry.mock.calls[0]).toEqual(['7', file]);
  });

  it('does not show a retry button for non-failed files', () => {
    // Arrange & Act
    renderList([{ id: '1', file, status: 'success', error: null }]);

    // Assert
    expect(screen.queryByRole('button', { name: '再試行' })).toBeNull();
  });

  it('renders the same file selected twice as two distinct rows', () => {
    // Arrange & Act: 同一ファイルでも id が異なれば別行として描画される（key 衝突しない）
    const { container } = renderList([
      { id: '1', file, status: 'success', error: null },
      { id: '2', file, status: 'uploading', error: null },
    ]);

    // Assert
    expect(container.querySelectorAll('li')).toHaveLength(2);
  });
});
