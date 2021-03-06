import ErrorView from '../components/ErrorView';
import Layout from '../components/Layout';
import useAuth from "../hooks/useAuth";
import { getWebMenuAction } from "../redux/actions/menu.action";
import { wrapper } from "../redux/store";
import WebInfo from "../sub_modules/share/model/webInfo";
import WebSocial from "../sub_modules/share/model/webSocial";
import { apiGetPageLayout } from "../utils/apis/pageLayoutApi";

const Error = (props: {
  webInfo?: WebInfo, webSocial?: WebSocial, statusCode?: number;
}) => {
  useAuth();
  const { statusCode = 500, ...seo } = props;
  const message = `Có lỗi xảy ra, xin vui lòng liên hệ quản trị viên`;
  return <Layout {...seo} useDefaultBackground><ErrorView message={message} errorCode={statusCode} /></Layout>
};

export const getServerSideProps = wrapper.getServerSideProps(async ({ res, store: { dispatch } }) => {
  const statusCode = res?.statusCode ?? 404;
  const { webInfo, webSocial, webMenuItems } = await apiGetPageLayout({ menu: true });
  dispatch(getWebMenuAction(webMenuItems));
  return {
    props: {
      statusCode, webInfo, webSocial
    }
  }
})

export default Error;
