import { useCallback } from 'react';
import { ImageEdit } from '../ImageEdit';

type Props = {
  imageName: string;
  imageUrl: string;
};

export function Image({ imageName, imageUrl }: Props): JSX.Element {
  const onClickHandler = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <a href="#" className="bg-slate-200" onClick={onClickHandler}>
      <p className="row-start-1 px-2 py-1 break-all">{imageName}</p>
      <div className="flex justify-center relative row-start-2">
        <img src={imageUrl} alt="" width="auto" height="300" />
        <div className="absolute top-2 right-2 z-10">
          <ImageEdit url={imageUrl} alt="" />
        </div>
      </div>
    </a>
  );
}
