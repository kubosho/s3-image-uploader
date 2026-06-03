'use client';

import { FileUpload } from '@ark-ui/react/file-upload';
import { type ReactNode } from 'react';

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

  const handleFileAccept = (details: FileUpload.FileAcceptDetails): void => {
    void uploadFiles(details.files);
  };

  return (
    <FileUpload.Root accept="image/*" maxFiles={IMAGE_UPLOAD_LIMIT} onFileAccept={handleFileAccept} className="min-h-full">
      <FileUpload.HiddenInput />
      {/* disableClick: ドロップゾーン内にギャラリーを内包するため、クリックでのファイルダイアログ起動を無効化する。投入はトリガーボタンとドロップで行う。 */}
      <FileUpload.Dropzone
        disableClick
        className="flex min-h-full flex-wrap gap-6 px-6 py-6 rounded-2 border-2 border-transparent transition-colors data-[dragging]:border-blue-400 data-[dragging]:bg-blue-50"
      >
        <div className="shrink-0 flex flex-col gap-4 w-64">
          <ImageUploadButton />
          <UploadProgressSummary fileStates={fileStates} />
          <UploadStatusList
            fileStates={fileStates}
            onRetry={(file) => {
              void retryFile(file);
            }}
          />
        </div>
        <div className="flex-1">{children}</div>
      </FileUpload.Dropzone>
    </FileUpload.Root>
  );
}
