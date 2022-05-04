import { ImageEdit } from '../ImageEdit';

type Props = {
  imageUrls: string[];
};

export function ImageList({ imageUrls }: Props): JSX.Element {
  const imageData = imageUrls.map((url) => {
    const u = new URL(url);
    const name = u.pathname.slice(1);

    return {
      name: decodeURI(name),
      url,
    };
  });

  return (
    <ul className="box-border columns-5 mt-4">
      {imageData.map(({ name, url }, index) => (
        <li key={index} className="break-inside-avoid grid grid-flow-row">
          <div className="relative">
            <p className="row-start-2 break-all">{name}</p>
            <img className="row-start-1" src={url} alt="" width="auto" height="300" />
            <div className="row-start-3 absolute top-0 right-0 z-10">
              <ImageEdit url={url} alt="" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
