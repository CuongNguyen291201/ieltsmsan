import GridTemplateCol46 from '../grid/GridTemplateCol46';
import ContactInfoPanel from './ContactInfoPanel';
import FooterNav from './FooterNav';
import './style.scss';

const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <GridTemplateCol46>
          <ContactInfoPanel />
          <FooterNav />
        </GridTemplateCol46>
      </div>
    </div>
  )
}

export default Footer;