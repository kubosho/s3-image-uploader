/**
 * @jest-environment jsdom
 */
import { describe, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import { type ImageUploadStatus } from '../../types/image-upload-status';
import { UploadStatusBadge } from '.';

const cases: Array<[ImageUploadStatus, string]> = [
  ['queued', '待機中'],
  ['uploading', 'アップロード中'],
  ['success', '完了'],
  ['error', '失敗'],
];

describe('UploadStatusBadge', () => {
  it.each(cases)('renders the label for status "%s"', (status, label) => {
    // Arrange & Act
    render(<UploadStatusBadge status={status} />);

    // Assert: 見つからなければ getByText が throw する
    screen.getByText(label);
  });
});
