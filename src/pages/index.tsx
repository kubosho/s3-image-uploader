import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { ErrorReason, ERROR_REASON } from '../constants/error_reason';
import { createImageUrl } from '../shared_logic/s3/image_url_creator';
import { fetchImageUrlList } from '../shared_logic/s3/image_url_fetcher';
import { Notification } from '../components/Notification';
import { SiteHeader } from '../components/SiteHeader';
import { convertImageFileToUint8Array } from '../shared_logic/convert_image_file_to_uint8array';
import { hasAwsEnv } from '../shared_logic/has_aws_env';
import { s3ClientInstance } from '../shared_logic/s3/s3_client_creator';
import { putObject } from '../shared_logic/s3/object_put';
import { UploadButton } from '../components/UploadButton';
import { ImageList } from '../components/ImageList';
import { Error } from '../components/Error';

type Props = {
  imageUrls: string[];
  isError?: boolean;
  errorReason?: ErrorReason;
};

const SECONDS_TO_EXPIRE = 600;

function Index({ imageUrls: initialImageUrls, isError, errorReason }): JSX.Element {
  const [imageUrls, setImageUrls] = useState(initialImageUrls);
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

  const onClickNotificationCloseButton = useCallback(() => {
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
        await putObject({ client: s3ClientInstance(), filename, body });

        const imageUrl = await createImageUrl({ imagePath: filename, secondsToExpire: SECONDS_TO_EXPIRE });
        setImageUrls((prevState) => [...prevState, imageUrl]);
      }
    })();
  }, [fileListIterator, imageUrls]);

  if (isError) {
    return <Error errorReason={errorReason} />;
  }

  return (
    <>
      <SiteHeader siteTitle="S3 image uploader" />
      <div className="absolute top-0 right-0">
        <UploadButton onChange={onChangeImageUpload} />
      </div>
      <ImageList imageUrls={imageUrls} />
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
  if (!hasAwsEnv(process.env)) {
    return {
      props: {
        imageUrls: [],
        isError: true,
        errorReason: ERROR_REASON.NOT_SET_AWS_ENVIRONMENT_VARIABLES,
      },
    };
  }

  const imageUrls = await fetchImageUrlList(s3ClientInstance(), SECONDS_TO_EXPIRE);

  return {
    props: {
      imageUrls,
    },
  };
}

export default Index;
