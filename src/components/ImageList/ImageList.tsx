import { ImageDetail } from '../../components/ImageDetail';

type Props = {
  imageUrls: string[];
};

export function ImageList({ imageUrls }: Props): JSX.Element {
  const imageData = imageUrls.map((url) => {
    const u = new URL(url);
    const name = u.pathname.slice(1);

    return {
      name,
      url,
    };
  });

  return (
    <ul className="box-border columns-5 mt-4">
      {imageData.map(({ name, url }, index) => (
        <li key={index} className="bg-slate-500 break-inside-avoid mb-4 p-1">
          <img src={url} alt="" width="auto" height="300" />
          <ImageDetail name={name} url={url} alt="" />
        </li>
      ))}
    </ul>
  );
}
