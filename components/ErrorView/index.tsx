import { memo, PropsWithoutRef } from 'react';
import './style.scss';
import Link from 'next/link';

export default memo((props: PropsWithoutRef<{ message?: string }>) => (
  <div id="_error_view">
    <div className="error-view container">
      <div>
        <h2>
          {props.message ?? 'Có lỗi xảy ra, xin vui lòng liên hệ quản trị viên'}
        </h2>
      </div>
      <Link href="/" as="/">
        <a>
          Quay lại trang chủ
        </a>
      </Link>
    </div>
  </div>
));