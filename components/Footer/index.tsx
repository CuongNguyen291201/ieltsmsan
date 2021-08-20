import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import GridTemplateCol46 from '../grid/GridTemplateCol46';
import ContactInfoPanel from './ContactInfoPanel';
import FooterNav from './FooterNav';
import './style.scss';

const Footer = (props: { webInfo?: WebInfo  , webSocial? :  WebSocial}) => {
  console.log('webInfo1111' , props.webInfo);
  console.log('WebSocial2' , props.webSocial);
  
  
  return (
    <div className="footer">
      <div className="container">
        <GridTemplateCol46>
          <ContactInfoPanel webInfo={props.webInfo} webSocial={props.webSocial}/>
          <FooterNav />
        </GridTemplateCol46>
      </div>
    </div>
  )
}

export default Footer;