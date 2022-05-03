import { useCallback } from 'react';
import { copyTextToClipboard } from './copy_text_to_clipboard';

type Props = {
  text: string;
  url: string;
};

export function CopyToClipboardButton({ text, url }: Props): JSX.Element {
  const onClick = useCallback(() => {
    copyTextToClipboard(`[${text}](${url})`);
  }, [text, url]);

  return (
    <button type="button" onClick={onClick}>
      &lt;&gt;
    </button>
  );
}
