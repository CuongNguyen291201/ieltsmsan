import ErrorView from '../components/ErrorView';
import Layout from '../components/Layout';
import { wrapper } from "../redux/store";
import WebInfo from "../sub_modules/share/model/webInfo";
import WebSeo from "../sub_modules/share/model/webSeo";
import WebSocial from "../sub_modules/share/model/webSocial";
import { apiWebInfo } from "../utils/apis/webInfoApi";
import { apiWebSocial } from "../utils/apis/webSocial";

const Error = (props: {
  webInfo?: WebInfo, webSeo?: WebSeo, webSocial?: WebSocial, statusCode?: number;
}) => {
  const { statusCode = 500, ...seo } = props;
  const message = `Có lỗi xảy ra, xin vui lòng liên hệ quản trị viên. ErrorCode: ${statusCode}`
  return <Layout {...seo}><ErrorView message={message} /></Layout>
};

export const getServerSideProps = wrapper.getServerSideProps(async ({ res }) => {
  const statusCode = res?.statusCode ?? 404;
  const [{ webInfo, webSeo }, webSocial] = await Promise.all([
    apiWebInfo({ serverSide: true }),
    apiWebSocial(true)
  ]);
  return {
    props: {
      statusCode, webInfo, webSeo, webSocial
    }
  }
})

export default Error;
