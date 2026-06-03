import { useEffect, useState } from 'react';

import { type FileUploadState } from '../../hooks/use-image-uploader';
import { UploadStatusBadge } from '../UploadStatusBadge';

type Props = {
  fileStates: FileUploadState[];
  onRetry: (id: string, file: File) => void;
};

function Thumbnail({ file }: { file: File }): React.JSX.Element {
  // object URL は effect 内で生成し、その cleanup でのみ revoke する。
  // StrictMode の effect 二重実行でも、最後に生成した URL が state に残り img が参照できる。
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return <img src={url ?? undefined} alt="" className="h-10 w-10 shrink-0 rounded-1 object-cover" />;
}

export function UploadStatusList({ fileStates, onRetry }: Props): React.JSX.Element {
  return (
    <ul className="flex flex-col gap-2">
      {fileStates.map((state) => (
        <li
          key={state.id}
          className="flex items-center gap-2 px-3 py-2 rounded-2 border border-neutral-border"
        >
          <Thumbnail file={state.file} />
          <span className="flex-1 truncate text-sm">{state.file.name}</span>
          <UploadStatusBadge status={state.status} />
          {state.status === 'error' && (
            <button
              type="button"
              onClick={() => onRetry(state.id, state.file)}
              className="shrink-0 px-2 py-0.5 rounded-1 text-sm bg-blue-600 text-monotone-100"
            >
              再試行
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
