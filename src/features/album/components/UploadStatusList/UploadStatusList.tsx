import { FileUpload } from '@ark-ui/react/file-upload';

import { type FileUploadState } from '../../hooks/use-image-uploader';
import { fileKey } from '../../utils/file-key';
import { UploadStatusBadge } from '../UploadStatusBadge';

type Props = {
  fileStates: FileUploadState[];
};

export function UploadStatusList({ fileStates }: Props): React.JSX.Element {
  const stateByKey = new Map(fileStates.map((state) => [fileKey(state.file), state]));

  return (
    <FileUpload.ItemGroup className="flex flex-col gap-2">
      <FileUpload.Context>
        {(fileUpload) =>
          fileUpload.acceptedFiles.map((file) => {
            const key = fileKey(file);
            const state = stateByKey.get(key);

            return (
              <FileUpload.Item
                key={key}
                file={file}
                className="flex items-center gap-2 px-3 py-2 rounded-2 border border-neutral-border"
              >
                <FileUpload.ItemPreview type="image/*" className="shrink-0">
                  <FileUpload.ItemPreviewImage className="h-10 w-10 rounded-1 object-cover" />
                </FileUpload.ItemPreview>
                <FileUpload.ItemName className="flex-1 truncate text-sm" />
                <UploadStatusBadge status={state?.status ?? 'queued'} />
              </FileUpload.Item>
            );
          })
        }
      </FileUpload.Context>
    </FileUpload.ItemGroup>
  );
}
