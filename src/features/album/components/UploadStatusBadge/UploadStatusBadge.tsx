import { type ImageUploadStatus } from '../../types/image-upload-status';

type Props = {
  status: ImageUploadStatus;
};

const STATUS_PRESENTATION: Record<ImageUploadStatus, { label: string; className: string }> = {
  queued: { label: '待機中', className: 'bg-monotone-200 text-neutral-text' },
  uploading: { label: 'アップロード中', className: 'bg-blue-100 text-blue-700' },
  success: { label: '完了', className: 'bg-green-100 text-green-700' },
  error: { label: '失敗', className: 'bg-red-100 text-red-700' },
};

export function UploadStatusBadge({ status }: Props): React.JSX.Element {
  const { label, className } = STATUS_PRESENTATION[status];

  return <span className={`inline-flex items-center px-2 py-0.5 rounded-1 text-sm ${className}`}>{label}</span>;
}
