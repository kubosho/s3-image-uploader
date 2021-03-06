import { useCallback, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import { useIsClient } from '../../hooks/use_is_client';
import { convertCdnUrl } from '../../shared_logic/cdn_url_converter';
import { deleteObject } from '../../shared_logic/s3/object_delete';
import { s3ClientInstance } from '../../shared_logic/s3/s3_client_creator';
import { imageListAtom } from '../../stores/image_list';
import { AltTextEdit } from '../AltTextEdit';
import { CopyToClipboardButton } from '../CopyToClipboardButton';

type Props = {
  url: string;
  alt: string;
};

export function ImageEdit({ url, alt }: Props): JSX.Element {
  const [imageList, setImageList] = useAtom(imageListAtom);
  const [isAltTextEditMode, setIsAltTextEditMode] = useState(false);
  const modifiedUrl = useMemo(() => convertCdnUrl(url), [url]);

  const onClickAltTextEditButton = useCallback(() => {
    setIsAltTextEditMode(true);
  }, []);

  const onDeleteImage = useCallback(() => {
    const confirmResult = confirm('Do you want to delete the image?');

    if (confirmResult) {
      (async () => {
        const filename = new URL(url).pathname.slice(1);
        const decodedFilename = decodeURI(filename);
        await deleteObject({ client: s3ClientInstance(), filename: decodedFilename });
        setImageList(imageList.filter((image) => image !== url));
      })();
    }
  }, [imageList, setImageList, url]);

  const onSubmitAltTextEdit = useCallback(() => {
    setIsAltTextEditMode(false);
  }, []);

  const isClient = useIsClient();
  if (!isClient) {
    return null;
  }

  return (
    <ul className="flex gap-2">
      <li>
        <button type="button" className="px-4 py-1 rounded-full bg-slate-900 text-slate-100" onClick={onDeleteImage}>
          Trash
        </button>
      </li>
      <li>
        {isAltTextEditMode ? (
          <AltTextEdit onClickSubmit={onSubmitAltTextEdit} />
        ) : (
          <button
            type="button"
            className="px-4 py-1 rounded-full bg-slate-900 text-slate-100"
            onClick={onClickAltTextEditButton}
          >
            Alt
          </button>
        )}
      </li>
      <li>
        <CopyToClipboardButton text={alt} url={modifiedUrl} />
      </li>
    </ul>
  );
}
