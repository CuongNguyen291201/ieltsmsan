import { Fragment, memo } from 'react'

export default memo((props: {
  banks?: Array<{
    name: string;
    headquater?: string;
    accountNumber: string;
    accountHolder?: string;
  }>;
  contactInfo?: string;
  phone?: string;
  email?: string;
  hideNotifMessage?: boolean;
  orderSerial?: string;
  hideHeader?:boolean;
}) => (
  <>
    <div>
      {!props.hideHeader && <h2>
        <p style={{ textAlign: "center", textDecoration: "underline" }}>
          Thông tin tài khoản
        </p>
      </h2>}
      <strong>
        Vui lòng chuyển khoản đến tài khoản sau:
        <br />
        {(props.banks || []).map(({ name, headquater, accountNumber, accountHolder }, i) => (
          <Fragment key={i}>
            <ul>
              <li>
                {name}&nbsp;{headquater || ''}
              </li>
              <li>
                STK: {accountNumber}
              </li>
              <li>
                Chủ TK: {accountHolder || ''}
              </li>
            </ul>
            {i !== props.banks?.length - 1 && <span style={{ fontWeight: 'lighter' }}><i>hoặc</i></span>}
          </Fragment>
        ))}
      </strong>
      <p>**Nội dung chuyển khoản: {props.orderSerial || '#######'} (mã đơn hàng)</p>
    </div >

    <div>
      <em>
        <p>Trong vòng 24h sau khi chuyển khoản thành công, mã code sẽ được gửi về email bạn đăng ký hoặc trang <b>Lịch sử giao dịch</b>.</p>
        Liên hệ hỗ trợ: {props.contactInfo || ''}
        <br />
        Phone: {props.phone || ''}
        <br />
        Email: {props.email || ''}
      </em>
    </div>
    {!props.hideNotifMessage && <div style={{ margin: "10px 0", color: "red", textAlign: "center" }}>
      <em><strong>
        Sau khi xác nhận chuyển khoản, chúng tôi sẽ liên hệ với bạn để cấp mã kích hoạt.
      </strong></em>
    </div>}
  </>
))