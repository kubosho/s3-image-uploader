import preview from '../../../../../.storybook/preview';
import { UploadProgressSummary } from '.';

const files = [
  new File(['a'], 'a.png', { type: 'image/png', lastModified: 1 }),
  new File(['b'], 'b.png', { type: 'image/png', lastModified: 2 }),
  new File(['c'], 'c.png', { type: 'image/png', lastModified: 3 }),
];

const meta = preview.meta({
  component: UploadProgressSummary,
});

export const InProgress = meta.story({
  args: {
    fileStates: [
      { id: '1', file: files[0], status: 'success', error: null },
      { id: '2', file: files[1], status: 'uploading', error: null },
      { id: '3', file: files[2], status: 'queued', error: null },
    ],
  },
});

export const WithFailure = meta.story({
  args: {
    fileStates: [
      { id: '1', file: files[0], status: 'success', error: null },
      { id: '2', file: files[1], status: 'success', error: null },
      { id: '3', file: files[2], status: 'error', error: 'Upload failed with status 500.' },
    ],
  },
});
