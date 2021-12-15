import { EmailTwoTone, LocationOnTwoTone, PhoneTwoTone } from "@mui/icons-material";
import FooterLogo from '../../public/images/home/footer-logo.png';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSocial from '../../sub_modules/share/model/webSocial';
const ContactInfoPanel = (props: { webInfo?: WebInfo, webSocial?: WebSocial }) => {
  const { webInfo, webSocial } = props;

  return (
    <div className="contact-info-panel">
      <div className="contact-info">
        <div className="logo-wrap">
          <img className="logo" src={webInfo?.webLogo || FooterLogo} alt="logo" />
        </div>

        <div className="text" style={{ marginBottom: "38px" }}>
          <div className="text-1">
            {webInfo?.contactInfo}
          </div>
          <div className="text-2">
            <p>
              {webInfo?.paymentInfo}
            </p>
          </div>
        </div>

        <div className="contact-item">
          <LocationOnTwoTone className="title-mark" />
          <span>{webInfo?.address}</span>
        </div>

        <div className="contact-item">
          <EmailTwoTone className="title-mark" />
          <span>{webInfo?.email}</span>
        </div>

        <div className="contact-item">
          <PhoneTwoTone className="title-mark" />
          <span>{webInfo?.hotLine}</span>
        </div>

      </div>
    </div>
  )
}

export default ContactInfoPanel;