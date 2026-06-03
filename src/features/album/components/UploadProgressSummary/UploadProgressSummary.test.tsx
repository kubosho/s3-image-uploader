/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import { type FileUploadState } from '../../hooks/use-image-uploader';
import { UploadProgressSummary } from '.';

const makeFile = (name: string, lastModified: number): File =>
  new File(['x'], name, { type: 'image/png', lastModified });

const states = (statuses: FileUploadState['status'][]): FileUploadState[] =>
  statuses.map((status, index) => ({ file: makeFile(`f${index}.png`, index), status, error: null }));

describe('UploadProgressSummary', () => {
  it('renders nothing when there are no files', () => {
    // Arrange & Act
    const { container } = render(<UploadProgressSummary fileStates={[]} />);

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it('summarizes completed count out of total', () => {
    // Arrange & Act
    render(<UploadProgressSummary fileStates={states(['success', 'uploading', 'queued'])} />);

    // Assert: 見つからなければ getByText が throw する
    screen.getByText('3件中1件完了');
  });

  it('includes the failed count when failures exist', () => {
    // Arrange & Act
    render(<UploadProgressSummary fileStates={states(['success', 'success', 'error'])} />);

    // Assert: 見つからなければ getByText が throw する
    screen.getByText('3件中2件完了（失敗1件）');
  });

  it('announces via aria-live for screen readers', () => {
    // Arrange & Act
    render(<UploadProgressSummary fileStates={states(['uploading'])} />);

    // Assert
    expect(screen.getByText('1件中0件完了').getAttribute('aria-live')).toBe('polite');
  });
});
