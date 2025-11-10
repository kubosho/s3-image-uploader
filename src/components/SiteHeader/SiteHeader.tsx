import Link from 'next/link';

import { auth } from '../../features/auth/auth';
import { SignInButton } from '../../features/auth/components/SignInButton';
import { SignOutButton } from '../../features/auth/components/SignOutButton';

export const SiteHeader = async (): Promise<React.JSX.Element> => {
  const session = await auth();

  return (
    <header className="bg-primary-main flex items-center justify-between p-4">
      <h1>
        <Link href="/" className="text-white">
          S3 image uploader
        </Link>
      </h1>
      {session?.user != null ? <SignOutButton /> : <SignInButton />}
    </header>
  );
};
