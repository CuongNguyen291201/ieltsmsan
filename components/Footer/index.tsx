import WebInfo from '../../sub_modules/share/model/webInfo';
import GridTemplateCol46 from '../grid/GridTemplateCol46';
import ContactInfoPanel from './ContactInfoPanel';
import FooterNav from './FooterNav';
import './style.scss';

const Footer = (props: { webInfo?: WebInfo }) => {
  return (
    <div className="footer">
      <div className="container">
        <GridTemplateCol46>
          <ContactInfoPanel webInfo={props.webInfo}/>
          <FooterNav />
        </GridTemplateCol46>
      </div>
    </div>
  )
}

export default Footer;