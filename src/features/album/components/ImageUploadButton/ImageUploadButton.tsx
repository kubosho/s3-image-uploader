'use client';

import { FileUpload } from '@ark-ui/react/file-upload';
import Image from 'next/image';

// アップロードの起点となるトリガーボタン。FileUpload.Root のコンテキスト内で使う。
export function ImageUploadButton(): React.JSX.Element {
  return (
    <FileUpload.Trigger className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-2 shadow-md bg-blue-600 text-monotone-100">
      <Image src="/images/icons/plus.svg" alt="" width={12} height={12} />
      Add file(s)
    </FileUpload.Trigger>
  );
}
