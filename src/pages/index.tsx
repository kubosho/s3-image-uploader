import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { ImageDetail } from '../components/ImageDetail';
import { keyboardEventOnIndexPageObservable } from '../shared_logic/keyboard_shortcut/keyboard_event_observable';
import { IndexPageShortcutKey } from '../shared_logic/keyboard_shortcut/shortcut_keys';
import { createImageUrl } from '../shared_logic/s3/image_url_creator';
import { createS3Client } from '../shared_logic/s3/s3_client_creator';
import { fetchObjectKeys } from '../shared_logic/s3/object_keys_fetcher';
import { Notification } from '../components/Notification';
import { SiteHeader } from '../components/SiteHeader';
import { putObject } from '../shared_logic/s3/object_put';
import { convertImageFileToUint8Array } from '../shared_logic/convert_image_file_to_uint8array';
import { UploadButton } from '../components/UploadButton';
import { ImageList } from '../components/ImageList';

type Props = {
  imageUrls: string[];
};

const SECONDS_TO_EXPIRE = 600;
const S3_CLIENT = createS3Client();

function Index({ imageUrls: initialImageUrls }): JSX.Element {
  const [imageUrls, setImageUrls] = useState(initialImageUrls);
  const [imageUrl, setImageUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);
  const [fileListIterator, setFileListIterator] = useState<IterableIterator<File> | null>(null);

  const onChangeImageUpload = useCallback((event: ChangeEvent) => {
    const { target } = event;

    if (target instanceof HTMLInputElement) {
      const fileList = Array.from(target.files);
      const fileListIterator = fileList[Symbol.iterator]();
      setFileListIterator(fileListIterator);
    }
  }, []);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNotificationShown(true);
    }, SECONDS_TO_EXPIRE * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (fileListIterator === null) {
        return;
      }

      for (const file of fileListIterator) {
        const filename = file.name;
        const body = await convertImageFileToUint8Array(file);
        await putObject({ client: S3_CLIENT, filename, body });

        const imageUrl = await createImageUrl({ imagePath: filename, secondsToExpire: SECONDS_TO_EXPIRE });
        setImageUrls((prevState) => [...prevState, imageUrl]);
      }
    })();
  }, [fileListIterator, imageUrls]);

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

  return (
    <>
      <SiteHeader siteTitle="S3 image uploader" />
      <UploadButton onChange={onChangeImageUpload} />
      <div className="box-border columns-5 mt-4">
        <ImageList imageUrls={imageUrls} onClick={onClickImage} />
      </div>
      <ImageDetail name="" url={imageUrl} alt="" open={isModalOpen} onClickCloseButton={onClickModalCloseButton} />
      <div className="absolute right-2 bottom-2">
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
  const objectKeys = await fetchObjectKeys(S3_CLIENT);
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
