import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import preview from '../../../../../.storybook/preview';
import { ImageUploader } from '.';

const queryClient = new QueryClient();

const meta = preview.meta({
  component: ImageUploader,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
});

export const Basic = meta.story({
  args: {
    children: <p>Gallery area</p>,
  },
});
