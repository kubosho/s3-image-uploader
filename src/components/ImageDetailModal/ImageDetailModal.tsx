import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useIsClient } from '../../hooks/use_is_client';

type Props = {
  name: string;
  url: string;
  alt: string;
  open: boolean;
  onClickCloseButton: () => void;
};

export function ImageDetailModal({ name, url, alt, open, onClickCloseButton }: Props): JSX.Element {
  const [modifiedUrl, setModifiedUrl] = useState('');

  useEffect(() => {
    if (url === '') {
      return;
    }

    const u = new URL(url);
    setModifiedUrl(`${u.origin}${u.pathname}`);
  }, [url]);

  const isClient = useIsClient();
  if (!isClient) {
    return null;
  }

  return createPortal(
    <dialog
      className={classNames(
        'bg-slate-900 bg-opacity-80 fixed flex flex-col items-center justify-center left-0 top-0 w-full h-full',
        {
          hidden: url === '',
        },
      )}
      open={open}
    >
      <div className="flex flex-col">
        <img src={url} alt="" width={800} />
        <p>{name}</p>
        <div className="w-full">
          <label className="text-white" htmlFor="alt-text">
            画像の代替テキスト
          </label>
          <textarea className="w-full" id="alt-text" name="alt-text" defaultValue={alt} />
          <label className="text-white" htmlFor="embedded-code">
            貼り付け用コード
          </label>
          <input
            className="w-full"
            type="text"
            value={`![${alt}](${modifiedUrl})`}
            id="embedded-code"
            name="embedded-code"
            readOnly
          />
        </div>
        <button className="absolute top-0 right-0" type="button" onClick={onClickCloseButton}>
          閉じる
        </button>
      </div>
    </dialog>,
    document.body,
  );
}
