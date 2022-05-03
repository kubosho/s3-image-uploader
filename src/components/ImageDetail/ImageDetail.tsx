import { useMemo } from 'react';
import { useIsClient } from '../../hooks/use_is_client';
import { convertCdnUrl } from '../../shared_logic/cdn_url_converter';
import { CopyToClipboardButton } from '../CopyToClipboardButton';

type Props = {
  name: string;
  url: string;
  alt: string;
};

export function ImageDetail({ name, url, alt }: Props): JSX.Element {
  const modifiedUrl = useMemo(() => convertCdnUrl(url), [url]);

  const isClient = useIsClient();
  if (!isClient) {
    return null;
  }

  return (
    <div className="bg-slate-900 bg-opacity-80 flex flex-col">
      <h2>{name}</h2>
      <div className="w-full mt-2">
        <label className="text-white" htmlFor="alt-text">
          Alt
        </label>
        <textarea className="w-full" id="alt-text" name="alt-text" defaultValue={alt} />
        <CopyToClipboardButton text={alt} url={modifiedUrl} />
      </div>
    </div>
  );
}
