type Props = {
  onClick: () => void;
};

export const UploadButton = ({ onClick }: Props): JSX.Element => {
  return (
    <button type="button" className="rounded-full" aria-label="Image upload" onClick={onClick}>
      +
    </button>
  );
};
