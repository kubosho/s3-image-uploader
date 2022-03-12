import { useCallback, useEffect, useState } from 'react';
import { ImageDetailModal } from '../components/ImageDetailModal';
import { keyboardEventOnIndexPageObservable } from '../shared_logic/keyboard_shortcut/keyboard_event_observable';
import { IndexPageShortcutKey } from '../shared_logic/keyboard_shortcut/shortcut_keys';
import { createImageUrl } from '../shared_logic/s3/image_url_creator';
import { createS3Client } from '../shared_logic/s3/s3_client_creator';
import { fetchObjectKeys } from '../shared_logic/s3/object_keys_fetcher';
import { Notification } from '../components/Notification';

type Props = {
  imageUrls: string[];
};

const SECONDS_TO_EXPIRE = 600;

function Index({ imageUrls }): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNotificationShown(true);
    }, SECONDS_TO_EXPIRE * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const obserevable = keyboardEventOnIndexPageObservable();
    const subscription = obserevable.subscribe((key) => {
      if (isModalOpen && key === IndexPageShortcutKey.ModalExit) {
        setIsModalOpen(false);
        setImageUrl('');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isModalOpen]);

  const onClickImage = useCallback((url: string) => {
    setImageUrl(url);
    setIsModalOpen(true);
  }, []);

  const onClickModalCloseButton = useCallback(() => {
    setIsModalOpen(false);
    setImageUrl('');
  }, []);

  const onClickNotificationCloseButton = useCallback(() => {
    setIsModalOpen(false);
    setImageUrl('');
    location.reload();
  }, []);

  return (
    <>
      <div className="box-border columns-5">
        {imageUrls.map((url, index) => (
          <button
            key={index}
            className="bg-slate-500 break-inside-avoid flex justify-center mb-6 p-1"
            onClick={() => onClickImage(url)}
          >
            <img src={url} alt="" width="auto" height="300" />
          </button>
        ))}
      </div>
      <ImageDetailModal name="" url={imageUrl} alt="" open={isModalOpen} onClickCloseButton={onClickModalCloseButton} />
      <div className="absolute right-2 top-2">
        <Notification
          isShown={isNotificationShown}
          text="Required reload."
          buttonText="OK"
          onClickCloseButton={onClickNotificationCloseButton}
        />
      </div>
    </>
  );
}

export async function getStaticProps(): Promise<{ props: Props }> {
  const s3Client = createS3Client();
  const objectKeys = await fetchObjectKeys(s3Client);
  const imageUrls = await Promise.all(
    objectKeys.map(async (key) => await createImageUrl({ imagePath: key, secondsToExpire: SECONDS_TO_EXPIRE })),
  );

  return {
    props: {
      imageUrls,
    },
  };
}

export default Index;
