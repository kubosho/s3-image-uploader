import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { useIsClient } from '../../hooks/use_is_client';

type Props = {
  name: string;
  url: string;
  alt?: string;
};

export function ImageDetailModal({ name, url, alt }: Props): JSX.Element {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return createPortal(
    <div
      className={classNames('bg-slate-900 bg-opacity-80 fixed left-0 top-0 w-full h-full', {
        hidden: url === '',
      })}
    >
      <img src={url} alt="" width={800} />
      <p>{name}</p>
      <div>
        <label htmlFor="alt-text">画像の代替テキスト</label>
        <textarea id="alt-text" name="alt-text" defaultValue={alt} />
      </div>
      <div>
        <label htmlFor="embedded-code">貼り付け用コード</label>
        <input type="text" value={`![${alt}](${url})`} id="embedded-code" name="embedded-code" readOnly />
      </div>
    </div>,
    document.body,
  );
}
