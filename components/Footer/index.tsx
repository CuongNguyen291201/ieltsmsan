import { Grid } from "@mui/material";
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import ContactInfoPanel from './ContactInfoPanel';
import FooterNav from './FooterNav';
import './style.scss';

const Footer = (props: { webInfo?: WebInfo, webSocial?: WebSocial }) => {
  return (
    <div className="footer">
      <div className="container">
        <Grid container spacing={6}>
          <Grid item xs={12} sm={12} md={5}>
            <ContactInfoPanel webInfo={props.webInfo} webSocial={props.webSocial} />
          </Grid>

          <Grid item xs={12} sm={12} md={7}>
            <FooterNav />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Footer;