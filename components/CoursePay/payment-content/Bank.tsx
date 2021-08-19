import { memo } from 'react'

export default memo(() => (
  <>
    <div>
      <h2>
        <p style={{ textAlign: "center", textDecoration: "underline" }}>
          Thông tin tài khoản
        </p>
      </h2>
      <strong>
        Vui lòng chuyển khoản đến tài khoản sau:
        <br />
        <ul>
          <li>
            Ngân hàng ... trụ sở ...
          </li>
          <li>
            STK: ...
          </li>
          <li>
            Chủ TK: ...
          </li>
        </ul>
      </strong>
      <p>**Nội dung chuyển khoản: ######## (mã đơn hàng)</p>
    </div >

    <div>
      <em>
        <p>Trong vòng 24h sau khi chuyển khoản thành công, mã code sẽ được gửi về email bạn đăng ký.</p>
        Liên hệ hỗ trợ: ...
        <br />
        Phone: ...
        <br />
        Email: ...
      </em>
    </div>
    <div style={{ margin: "10px 0", color: "red", textAlign: "center" }}>
      <em><strong>
        Sau khi xác nhận chuyển khoản, chúng tôi sẽ liên hệ với bạn để cấp mã kích hoạt.
      </strong></em>
    </div>
  </>
))