import ErrorView from '../components/ErrorView'
import Layout from '../components/Layout'
import { wrapper } from "../redux/store"
import WebInfo from "../sub_modules/share/model/webInfo"
import WebSocial from "../sub_modules/share/model/webSocial"
import { apiGetPageLayout } from "../utils/apis/pageLayoutApi"
import { getWebMenuAction } from "../redux/actions/menu.action";

const ErrorNotFound = (props: {
  webInfo?: WebInfo, webSocial?: WebSocial
}) => {
  return <Layout {...props}>
    <ErrorView message="Không tìm thấy trang" />
  </Layout>
}

export const getStaticProps = wrapper.getStaticProps(async ({ store: { dispatch } }) => {
  const { webInfo, webSocial, webMenuItems } = await apiGetPageLayout({ menu: true });
  dispatch(getWebMenuAction(webMenuItems));
  return {
    props: {
      webInfo, webSocial
    }
  }
})

export default ErrorNotFound;
