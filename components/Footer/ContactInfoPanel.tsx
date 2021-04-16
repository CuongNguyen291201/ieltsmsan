import FooterLogo from '../../public/home/footer-logo.png';
import HomeFooterBgr from '../../public/home/home-footer.png';
import IconLocation from '../../public/home/icon-location.png';
import IconPhone from '../../public/home/icon-phone.png';
import IconEmail from '../../public/home/icon-email.png';

const ContactInfoPanel = () => {
  return (
    <div className="contact-info-panel">
      <img className="contact-bgr" src={HomeFooterBgr} alt="contact-info-bgr" />
      <div className="contact-info">
        <img className="logo" src={FooterLogo} alt="logo" />

        <div className="contact-item">
          <img className="title-mark" src={IconLocation} alt="location" />
          <span>Số 69 ngõ 40 Tạ Quang Bửu. Q.Hai Bà Trưng. TP. Hà Nội</span>
        </div>

        <div className="contact-item">
          <img className="title-mark" src={IconPhone} alt="location" />
          <span>0947 0909 81</span>
        </div>

        <div className="contact-item">
          <img className="title-mark" src={IconEmail} alt="location" />
          <span>info@onthisinhvien.com</span>
        </div>


        <section>
          <p style={{ marginTop: '50px', marginBottom: '20px', fontSize: '12px' }}>
            <strong>Công ty Cổ phần Đầu tư và Phát triển Koolsoft</strong>
          </p>
          <p style={{ fontSize: '12px' }}>
            <b>MST</b>: 0106353044 do sở kế hoạch và đầu tư thành phố Hà Nội cấp lần đầu ngày 04/11/2013
            <br />
            <b>Email</b>: info@onthisinhvien.com
            <br />
            <b>Địa chỉ</b>: Số 5B N2 TT5, Khu đô thị Bắc Linh Đàm Phường Đại Kim, Quận Hoàng Mai, TP Hà Nội
            <br />
            <b>Hotline</b>: 0947 0909 81
          </p>
        </section>
      </div>
    </div>
  )
}

export default ContactInfoPanel;