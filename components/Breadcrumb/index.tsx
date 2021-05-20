import { useRouter } from 'next/router';
import { Fragment, memo } from 'react';
import './style.scss';

const _BreadcrumbItem = (props: { name: string; slug?: string; isEnd?: boolean; addRoot?: boolean }) => {
  const router = useRouter();
  const { name, slug = '/', isEnd = false, addRoot = true } = props;
  return (
    <>
      <span className={`breadcrumb-item${isEnd ? ' active' : ''}`} onClick={() => {
        if (!addRoot) router.push(slug);
        else router.push({ pathname: slug, query: { root: router.query.root } })
      }}>
        {name}
      </span>
      {!isEnd && <span className="breadcrumb-slash">/</span>} 
      {/* <i className="fas fa-caret-right breadcrumb-caret" />} */}
    </>
  )
}

const BreadcrumbItem = memo(_BreadcrumbItem);

const Breadcrumb = (props: { items: Array<{ name: string; slug?: string; addRoot?: boolean }> }) => {
  const { items } = props;
  return (
    <div className="breadcrumb">
      <div className="container main-content">
        <BreadcrumbItem name="Trang chủ" addRoot={false} />
        {items.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem name={item.name} slug={item.slug} isEnd={index === items.length - 1} addRoot={item.addRoot} />
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default memo(Breadcrumb);