import { useRouter } from 'next/router';
import { Fragment, memo } from 'react';
import './style.scss';

const _BreadcrumbItem = (props: { name: string; slug?: string; isEnd?: boolean; }) => {
  const router = useRouter();
  const { name, slug = '/', isEnd = false } = props;
  return (
    <>
      <span className={`breadcrumb-item${isEnd ? ' active' : ''}`} onClick={() => {
        router.push(slug);
      }}>
        {name}
      </span>
      {!isEnd && <span className="breadcrumb-slash">/</span>}
      {/* <i className="fas fa-caret-right breadcrumb-caret" />} */}
    </>
  )
}

const BreadcrumbItem = memo(_BreadcrumbItem);

const Breadcrumb = (props: { items: Array<{ name: string; slug?: string; }> }) => {
  const { items } = props;
  return (
    <div className="container breadcrumb">
      <div className="main-content">
        <BreadcrumbItem name="Trang chủ" />
        {items.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem name={item.name} slug={item.slug} isEnd={index === items.length - 1} />
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default memo(Breadcrumb);