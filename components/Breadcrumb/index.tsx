import Link from 'next/link';
import { Fragment, memo } from 'react';
import './style.scss';

const _BreadcrumbItem = (props: { name: string; slug?: string; isEnd?: boolean; }) => {
  const { name, slug = '/', isEnd = false } = props;
  return (
    <>

      {!isEnd ? <Link href={slug}><a className="plain-anchor-tag">
        <span className="breadcrumb-item">
          {name}
        </span>
      </a>
      </Link> : <span className="breadcrumb-item active">{name}</span>}
      {!isEnd && <span className="breadcrumb-slash"><i className="fas fa-caret-right" /></span>}
      {/* <i className="fas fa-caret-right breadcrumb-caret" />} */}
    </>
  )
}

const BreadcrumbItem = memo(_BreadcrumbItem);

const Breadcrumb = (props: { items: Array<{ name: string; slug?: string; }> }) => {
  const { items } = props;
  return (
    <div id="breadcrumb" className="breadcrumb">
      <div className="container">
        <div className="main-content">
          <BreadcrumbItem name="Trang chủ" />
          {items.map((item, index) => (
            <Fragment key={index}>
              <BreadcrumbItem name={item.name} slug={item.slug} isEnd={index === items.length - 1} />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(Breadcrumb);