import { FileUpload } from '@ark-ui/react/file-upload';

import preview from '../../../../../.storybook/preview';
import { UploadStatusList } from '.';

const sampleFiles = [
  new File(['a'], 'sunset.png', { type: 'image/png', lastModified: 1 }),
  new File(['b'], 'mountain.png', { type: 'image/png', lastModified: 2 }),
  new File(['c'], 'river.png', { type: 'image/png', lastModified: 3 }),
];

const meta = preview.meta({
  component: UploadStatusList,
  decorators: [
    (Story) => (
      <FileUpload.Root accept="image/*" maxFiles={10} defaultAcceptedFiles={sampleFiles}>
        <FileUpload.HiddenInput />
        <Story />
      </FileUpload.Root>
    ),
  ],
});

export const Mixed = meta.story({
  args: {
    fileStates: [
      { file: sampleFiles[0], status: 'success', error: null },
      { file: sampleFiles[1], status: 'uploading', error: null },
      { file: sampleFiles[2], status: 'error', error: 'Upload failed with status 500.' },
    ],
    onRetry: () => {},
  },
});
