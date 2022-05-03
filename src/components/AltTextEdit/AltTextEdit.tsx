type Props = {
  initialText?: string;
  onClickSubmit?: () => void;
};

export function AltTextEdit({ initialText, onClickSubmit }: Props): JSX.Element {
  return (
    <>
      <label htmlFor="alt-text">Alt</label>
      <textarea className="w-full" id="alt-text" name="alt-text" defaultValue={initialText} />
      <button type="button" onClick={onClickSubmit}>
        Submit
      </button>
    </>
  );
}
