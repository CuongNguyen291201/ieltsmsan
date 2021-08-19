import { memo } from 'react';
import { ROUTER_TRANSACTION_HISTORY } from '../../../utils/router';

export default memo(() => (
  <>
    <p className="payment-content">
      Sau khi điền thông tin mua hàng và bấm hoàn tất đơn hàng, hệ thống sẽ hiển thị mã QR kèm hướng dẫn. Bạn cần tải và cài ứng dụng Momo trên điện thoại và sử dụng để quét mã QR trên để thanh toán.
      <br />
      Momo-Phương thức thanh toán nhanh, tiện lợi, an toàn được cấp phép và quản lý bởi NH Nhà Nước Việt Nam.
    </p>
    <br />
    <strong>
      Khi thanh toán thành công, mã code sẽ được gửi về email bên dưới và trang
      &nbsp;
      <a href={ROUTER_TRANSACTION_HISTORY}>Lịch sử giao dịch</a> của bạn
    </strong>
  </>
))