import { useCallback, useMemo, useState } from 'react';
import { useIsClient } from '../../hooks/use_is_client';
import { convertCdnUrl } from '../../shared_logic/cdn_url_converter';
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
