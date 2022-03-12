type Props = {
  isShown: boolean;
  text: string;
  buttonText: string;
  onClickCloseButton: () => void;
};

export const Notification = ({ isShown, text, buttonText, onClickCloseButton }: Props): JSX.Element =>
  isShown && (
    <div role="alertdialog" aria-describedby="notificationDescription">
      <div className="flex" role="document" tabIndex={0}>
        <p id="notificationDescription">{text}</p>
        <button type="button" onClick={onClickCloseButton}>
          {buttonText}
        </button>
      </div>
    </div>
  );
