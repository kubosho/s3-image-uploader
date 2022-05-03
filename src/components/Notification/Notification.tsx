import { useEffect, useRef } from 'react';

type Props = {
  isShown: boolean;
  text: string;
  buttonText: string;
  onClickCloseButton: () => void;
};

export const Notification = ({ isShown, text, buttonText, onClickCloseButton }: Props): JSX.Element => {
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    ref.current && ref.current.focus();
  }, [isShown]);

  if (!isShown) {
    return null;
  }

  return (
    <div
      className="p-3 border border-navy-600 bg-slate-100 text-slate-900"
      role="alertdialog"
      aria-describedby="notificationDescription"
      aria-live="polite"
    >
      <div className="flex" role="document">
        <p id="notificationDescription">{text}</p>
        <button ref={ref} type="button" onClick={onClickCloseButton}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};
