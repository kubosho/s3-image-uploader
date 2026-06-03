import { type FileUploadState } from '../../hooks/use-image-uploader';

type Props = {
  fileStates: FileUploadState[];
};

export function UploadProgressSummary({ fileStates }: Props): React.JSX.Element | null {
  const total = fileStates.length;
  if (total === 0) {
    return null;
  }

  const completed = fileStates.filter((state) => state.status === 'success').length;
  const failed = fileStates.filter((state) => state.status === 'error').length;

  const summary = failed > 0 ? `${total}件中${completed}件完了（失敗${failed}件）` : `${total}件中${completed}件完了`;

  return (
    <p aria-live="polite" className="text-sm text-neutral-subtext">
      {summary}
    </p>
  );
}
