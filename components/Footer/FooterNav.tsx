import GridTemplateCol55 from '../grid/GridTemplateCol55'
import SectionLabel from '../SectionLabel'
import { FooterNavItemProps } from './FooterNavItem'

const FooterNav = () => {
  const utils: FooterNavItemProps[] = [
    { title: 'Trang chủ', slug: '/' },
    { title: 'Giới thiệu', slug: '/gioi-thieu' },
    { title: 'Khoá học', slug: '/khoa-hoc' },
    { title: 'Tin tức', slug: '/tin-tuc' },
    { title: 'Liên hệ', slug: '/lien-he' }
  ]

  const policies: FooterNavItemProps[] =[
    { title: 'Chính sách chung', slug: '/chinh-sach-chung' },
    { title: 'Chính sách bảo mật thông tin', slug: '/chinh-sach-bao-mat-thong-tin' },
    { title: 'Hướng dẫn mua hàng', slug: '/huong-dan-mua-hang' },
    { title: 'Hướng dẫn kích hoạt khoá học', slug: '/huong-dan-kich-hoat-khoa-hoc' },
    { title: 'Chính sách hoàn trả học phí', slug: '/chinh-sach-hoan-tra-hoc-phi' }
  ]

  return (
    <div className="footer-nav">
      <GridTemplateCol55>
        <div className="utils">
          <SectionLabel />
          <div>
            TIỆN ÍCH
          </div>
          <div>
            Trang chủ
          </div>
        </div>
      </GridTemplateCol55>
    </div>
  )
}

export default FooterNav;