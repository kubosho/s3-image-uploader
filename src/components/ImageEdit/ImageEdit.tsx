import { useCallback, useMemo, useState } from 'react';
import { useIsClient } from '../../hooks/use_is_client';
import { convertCdnUrl } from '../../shared_logic/cdn_url_converter';
import { deleteObject } from '../../shared_logic/s3/object_delete';
import { s3ClientInstance } from '../../shared_logic/s3/s3_client_creator';
import { AltTextEdit } from '../AltTextEdit';
import { CopyToClipboardButton } from '../CopyToClipboardButton';

type Props = {
  url: string;
  alt: string;
};

export function ImageEdit({ url, alt }: Props): JSX.Element {
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
      })();
    }
  }, []);

  const onSubmitAltTextEdit = useCallback(() => {
    setIsAltTextEditMode(false);
  }, []);

  const isClient = useIsClient();
  if (!isClient) {
    return null;
  }

  return (
    <ul className="flex justify-center">
      <li>
        <button type="button" onClick={onDeleteImage}>
          Trash
        </button>
        {isAltTextEditMode ? (
          <AltTextEdit onClickSubmit={onSubmitAltTextEdit} />
        ) : (
          <button type="button" onClick={onClickAltTextEditButton}>
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
