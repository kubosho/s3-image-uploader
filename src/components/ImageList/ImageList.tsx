import { Image } from '../Image';

type Props = {
  imageUrls: string[];
};

export function ImageList({ imageUrls }: Props): React.JSX.Element {
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
        <li key={index} className="break-inside-avoid grid grid-flow-row mb-4">
          <Image imageName={name} imageUrl={url} />
        </li>
      ))}
    </ul>
  );
}
