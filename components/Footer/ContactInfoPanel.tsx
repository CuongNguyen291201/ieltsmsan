import FooterLogo from '../../public/home/footer-logo.png';
import HomeFooterBgr from '../../public/home/home-footer.png';
import IconLocation from '../../public/home/icon-location.png';
import IconPhone from '../../public/home/icon-phone.png';
import IconEmail from '../../public/home/icon-email.png';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import FacebookIcon from '@material-ui/icons/Facebook';
const ContactInfoPanel = (props: { webInfo?: WebInfo , webSocial?:WebSocial }) => {
  const { webInfo ,webSocial} = props;
  
  return (
    <div className="contact-info-panel">
      <div className="contact-info">
        <img className="logo" src={webInfo?.webLogo || FooterLogo} alt="logo" />

        <div className="contact-item">
          <img className="title-mark" src={IconLocation} alt="location" />
          <span>{webInfo?.address}</span>
        </div>

        <div className="contact-item">
          <img className="title-mark" src={IconPhone} alt="location" />
          <span>{webInfo?.hotLine}</span>
        </div>

        <div className="contact-item">
          <img className="title-mark" src={IconEmail} alt="location" />
          <span>{webInfo?.email}</span>
        </div>


        <div className="text">
          <div className="text-1">
            {webInfo?.contactInfo}
          </div>
          <div className="text-2">
            <p>
              <b>MST</b>: {webInfo?.paymentInfo}
            </p>
            <p>
              <b>Email</b>: {webInfo?.email}
            </p>
            <p>
              <b>Địa chỉ</b>: {webInfo?.address}
            </p>
            <p>
              <b>Hotline</b>: {webInfo?.hotLine}
            </p>
            <p>
              Kết nối với chúng tôi : <a target="_blank" href={webSocial[0]?.fanPage}><i  className="fab fa-facebook"></i></a>
              </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactInfoPanel;