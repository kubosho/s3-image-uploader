import { useCallback, useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { useInstance } from '../hooks/use_instance';
import { ImageDetailModal } from '../components/ImageDetailModal';
import { keyboardEventOnIndexPageObservable } from '../shared_logic/keyboard_shortcut/keyboard_event_observable';
import { IndexPageShortcutKey } from '../shared_logic/keyboard_shortcut/shortcut_keys';
import { createS3Client } from '../shared_logic/s3/s3_client_creator';
import { fetchObjectKeys } from '../shared_logic/object_keys_fetcher';
import { createImageUrl } from '../shared_logic/image_url_creator';

type Props = {
  imageUrls: string[];
};

function Index({ imageUrls }): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const keyboardEvent$ = useInstance(() => keyboardEventOnIndexPageObservable());
  const subscription = useInstance(() => new Subscription());

  useEffect(() => {
    subscription.add(
      keyboardEvent$.subscribe((key) => {
        if (isModalOpen && key === IndexPageShortcutKey.ModalExit) {
          setIsModalOpen(false);
        }
      }),
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [isModalOpen, keyboardEvent$, subscription]);

  const onClick = useCallback((url: string) => {
    setImageUrl(url);
    setIsModalOpen(true);
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
      {isModalOpen && <ImageDetailModal name="" url={imageUrl} alt="" />}
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
