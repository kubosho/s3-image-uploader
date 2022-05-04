import { useCallback, useState } from 'react';
import classNames from 'classnames';
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
    <a href="#" onClick={onClickHandler}>
      <p className="row-start-1 break-all">{imageName}</p>
      <div className="inline-flex relative row-start-2">
        <img className="" src={imageUrl} alt="" width="auto" height="300" />
        <div className="absolute top-0 right-0 z-10">
          <ImageEdit url={imageUrl} alt="" />
        </div>
      </div>
    </a>
  );
}
