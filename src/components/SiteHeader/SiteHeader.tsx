import Link from 'next/link';

type Props = {
  siteTitle: string;
};

export const SiteHeader = ({ siteTitle }: Props): JSX.Element => (
  <header className="p-3 bg-navy-600">
    <h1>
      <Link href="/">
        <a className="text-white">{siteTitle}</a>
      </Link>
    </h1>
  </header>
);
