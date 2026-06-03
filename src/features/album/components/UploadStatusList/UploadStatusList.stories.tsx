import preview from '../../../../../.storybook/preview';
import { UploadStatusList } from '.';

const sampleFiles = [
  new File(['a'], 'sunset.png', { type: 'image/png', lastModified: 1 }),
  new File(['b'], 'mountain.png', { type: 'image/png', lastModified: 2 }),
  new File(['c'], 'river.png', { type: 'image/png', lastModified: 3 }),
];

const meta = preview.meta({
  component: UploadStatusList,
});

export const Mixed = meta.story({
  args: {
    fileStates: [
      { id: '1', file: sampleFiles[0], status: 'success', error: null },
      { id: '2', file: sampleFiles[1], status: 'uploading', error: null },
      { id: '3', file: sampleFiles[2], status: 'error', error: 'Upload failed with status 500.' },
    ],
    onRetry: () => {},
  },
});
