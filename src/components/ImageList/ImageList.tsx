import { useCallback } from 'react';

type Props = {
  imageUrls: string[];
  onClick?: (imageUrl: string) => void;
};

export function ImageList({ imageUrls, onClick }: Props): JSX.Element {
  const onClickImage = useCallback(
    (imageUrl: string) => {
      if (onClick !== undefined) {
        onClick(imageUrl);
      }
    },
    [onClick],
  );

  return (
    <>
      {imageUrls.map((url, index) => (
        <button
          key={index}
          className="bg-slate-500 break-inside-avoid flex justify-center mb-4 p-1"
          onClick={() => onClickImage(url)}
        >
          <img src={url} alt="" width="auto" height="300" />
        </button>
      ))}
    </>
  );
}
