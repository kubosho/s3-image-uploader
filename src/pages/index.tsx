import { useCallback, useEffect, useState } from 'react';
import { ImageDetailModal } from '../components/ImageDetailModal';
import { keyboardEventOnIndexPageObservable } from '../shared_logic/keyboard_shortcut/keyboard_event_observable';
import { IndexPageShortcutKey } from '../shared_logic/keyboard_shortcut/shortcut_keys';
import { createImageUrl } from '../shared_logic/s3/image_url_creator';
import { createS3Client } from '../shared_logic/s3/s3_client_creator';
import { fetchObjectKeys } from '../shared_logic/s3/object_keys_fetcher';

type Props = {
  imageUrls: string[];
};

function Index({ imageUrls }): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const obserevable = keyboardEventOnIndexPageObservable();
    const subscription = obserevable.subscribe((key) => {
      if (isModalOpen && key === IndexPageShortcutKey.ModalExit) {
        setIsModalOpen(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isModalOpen]);

  const onClick = useCallback((url: string) => {
    setImageUrl(url);
    setIsModalOpen(true);
  }, []);

  const onClickCloseButton = useCallback(() => {
    setIsModalOpen(false);
    setImageUrl('');
  }, []);

  return (
    <>
      <div className="box-border columns-5">
        {imageUrls.map((url, index) => (
          <button
            key={index}
            className="bg-slate-500 break-inside-avoid flex justify-center mb-6 p-1"
            onClick={() => onClick(url)}
          >
            <img src={url} alt="" width="auto" height="300" />
          </button>
        ))}
      </div>
      <ImageDetailModal name="" url={imageUrl} alt="" open={isModalOpen} onClickCloseButton={onClickCloseButton} />
    </>
  );
}

export async function getStaticProps(): Promise<{ props: Props }> {
  const s3Client = createS3Client();
  const objectKeys = await fetchObjectKeys(s3Client);
  const imageUrls = await Promise.all(
    objectKeys.map(async (key) => await createImageUrl({ imagePath: key, secondsToExpire: 600 })),
  );

  return {
    props: {
      imageUrls,
    },
  };
}

export default Index;
