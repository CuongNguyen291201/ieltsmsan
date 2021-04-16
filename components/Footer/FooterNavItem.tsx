import Link from 'next/link';

export type FooterNavItemProps = { title?: string; slug?: string };

const FooterNavItem = (props: FooterNavItemProps) => {
  const { title = '', slug = '' } = props;
  return (
    <Link href={slug} as={slug}>
      <div className="footer-nav-item">
        {title}
      </div>
    </Link>
  )
}

export default FooterNavItem;
