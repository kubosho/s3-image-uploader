'use client';

import { FileUpload, useFileUpload } from '@ark-ui/react/file-upload';
import { type ReactNode, useCallback, useRef } from 'react';

import { IMAGE_UPLOAD_LIMIT } from '../../../../constants/image-upload-limit';
import { useImageUploader } from '../../hooks/use-image-uploader';
import { ImageUploadButton } from '../ImageUploadButton';
import { UploadProgressSummary } from '../UploadProgressSummary';
import { UploadStatusList } from '../UploadStatusList';

type Props = {
  children: ReactNode;
};

export function ImageUploader({ children }: Props): React.JSX.Element {
  const { uploadFiles, retryFile, fileStates } = useImageUploader();
  const apiRef = useRef<ReturnType<typeof useFileUpload> | null>(null);

  const handleFileAccept = useCallback(
    (details: FileUpload.FileAcceptDetails): void => {
      if (details.files.length === 0) {
        return;
      }
      void uploadFiles(details.files);
      // ark-ui には受け取ったファイルを渡させるだけにし、内部には溜め込ませない。状態とサムネイルは fileStates 側で保持するので表示は失われない。
      // これで同一ファイルの再アップロードが可能になり、maxFiles もバッチ単位の上限として働く。
      // クリアは onFileAccept(=状態変更コールバック)内での再帰的な set を避けるためマイクロタスクへ逃がす。
      queueMicrotask(() => apiRef.current?.clearFiles());
    },
    [uploadFiles],
  );

  const fileUpload = useFileUpload({
    accept: 'image/*',
    maxFiles: IMAGE_UPLOAD_LIMIT,
    onFileAccept: handleFileAccept,
  });
  apiRef.current = fileUpload;

  return (
    <FileUpload.RootProvider value={fileUpload} className="min-h-full">
      <FileUpload.HiddenInput />
      {/* disableClick: ドロップゾーン内にギャラリーを内包するため、クリックでのファイルダイアログ起動を無効化する。投入はトリガーボタンとドロップで行う。 */}
      <FileUpload.Dropzone
        disableClick
        className="flex min-h-full flex-wrap gap-6 px-6 py-6 rounded-2 border-2 border-transparent transition-colors data-[dragging]:border-blue-400 data-[dragging]:bg-blue-50"
      >
        <div className="shrink-0 flex flex-col gap-4 w-64">
          <ImageUploadButton />
          <UploadProgressSummary fileStates={fileStates} />
          <UploadStatusList fileStates={fileStates} onRetry={(id, file) => void retryFile(id, file)} />
        </div>
        <div className="flex-1">{children}</div>
      </FileUpload.Dropzone>
    </FileUpload.RootProvider>
  );
}
