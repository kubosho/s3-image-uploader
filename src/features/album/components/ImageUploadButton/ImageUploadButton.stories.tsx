import { FileUpload } from '@ark-ui/react/file-upload';

import preview from '../../../../../.storybook/preview';
import { ImageUploadButton } from '.';

const meta = preview.meta({
  component: ImageUploadButton,
  decorators: [
    (Story) => (
      <FileUpload.Root accept="image/*" maxFiles={10}>
        <FileUpload.HiddenInput />
        <Story />
      </FileUpload.Root>
    ),
  ],
});

export const Basic = meta.story({
  args: {},
});
