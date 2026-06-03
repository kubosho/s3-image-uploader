/**
 * @jest-environment jsdom
 */
import { FileUpload } from '@ark-ui/react/file-upload';
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import { type FileUploadState } from '../../hooks/use-image-uploader';
import { UploadStatusList } from '.';

const file = new File(['x'], 'photo.png', { type: 'image/png', lastModified: 1 });

const renderList = (fileStates: FileUploadState[]): ReturnType<typeof render> =>
  render(
    <FileUpload.Root accept="image/*" maxFiles={10} defaultAcceptedFiles={[file]}>
      <FileUpload.HiddenInput />
      <UploadStatusList fileStates={fileStates} />
    </FileUpload.Root>,
  );

describe('UploadStatusList', () => {
  it('shows the file name and its status badge', () => {
    renderList([{ file, status: 'uploading', error: null }]);

    expect(screen.getByText('photo.png')).toBeTruthy();
    expect(screen.getByText('アップロード中')).toBeTruthy();
  });

  it('reflects the status transition in the badge label', () => {
    const { rerender } = renderList([{ file, status: 'uploading', error: null }]);
    expect(screen.getByText('アップロード中')).toBeTruthy();

    rerender(
      <FileUpload.Root accept="image/*" maxFiles={10} defaultAcceptedFiles={[file]}>
        <FileUpload.HiddenInput />
        <UploadStatusList fileStates={[{ file, status: 'success', error: null }]} />
      </FileUpload.Root>,
    );

    expect(screen.getByText('完了')).toBeTruthy();
    expect(screen.queryByText('アップロード中')).toBeNull();
  });
});
