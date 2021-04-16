import { Fragment } from 'react'
import GridTemplateCol55 from '../grid/GridTemplateCol55'
import SectionLabel from '../SectionLabel'
import FooterNavItem, { FooterNavItemProps } from './FooterNavItem'

const FooterNav = () => {
  const utils: FooterNavItemProps[] = [
    { title: 'Trang chủ', slug: '/' },
    { title: 'Giới thiệu', slug: '/gioi-thieu' },
    { title: 'Khoá học', slug: '/khoa-hoc' },
    { title: 'Tin tức', slug: '/tin-tuc' },
    { title: 'Liên hệ', slug: '/lien-he' }
  ]

  const policies: FooterNavItemProps[] = [
    { title: 'Chính sách chung', slug: '/chinh-sach-chung' },
    { title: 'Chính sách bảo mật thông tin', slug: '/chinh-sach-bao-mat-thong-tin' },
    { title: 'Hướng dẫn mua hàng', slug: '/huong-dan-mua-hang' },
    { title: 'Hướng dẫn kích hoạt khoá học', slug: '/huong-dan-kich-hoat-khoa-hoc' },
    { title: 'Chính sách hoàn trả học phí', slug: '/chinh-sach-hoan-tra-hoc-phi' }
  ]

  return (
    <div className="footer-nav">
      <div className="footer-label">
        <SectionLabel />
      </div>
      <GridTemplateCol55>
        <div id="utils">
          <div className="nav-title">
            TIỆN ÍCH
          </div>
          {utils.map((e, i) => (
            <Fragment key={i}>
              <FooterNavItem title={e.title} slug={e.slug} />
            </Fragment>
          ))}
        </div>

        <div id="policies">
          <div className="nav-title">
            CÁC CHÍNH SÁCH
          </div>
          {policies.map((e, i) => (
            <Fragment key={i}>
              <FooterNavItem title={e.title} slug={e.slug} />
            </Fragment>
          ))}
        </div>
      </GridTemplateCol55>
    </div>
  )
}

export default FooterNav;