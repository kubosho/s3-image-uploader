import preview from '../../../../../.storybook/preview';
import { UploadStatusBadge } from '.';

const meta = preview.meta({
  component: UploadStatusBadge,
});

export const Queued = meta.story({ args: { status: 'queued' } });
export const Uploading = meta.story({ args: { status: 'uploading' } });
export const Success = meta.story({ args: { status: 'success' } });
export const Failed = meta.story({ args: { status: 'error' } });
