import WebInfo from "../sub_modules/share/model/webInfo"
import { WebMenuItem } from "../sub_modules/share/model/webMenuItem";
import WebSeo from "../sub_modules/share/model/webSeo";
import WebSocial from "../sub_modules/share/model/webSocial";

type PageLayout = {
  webInfo: WebInfo | null;
  webSeo: WebSeo | null;
  webSocial: WebSocial | null;
  webMenuItems: WebMenuItem[];
}

export default PageLayout;