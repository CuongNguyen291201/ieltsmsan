import ErrorView from '../components/ErrorView'
import Layout from '../components/Layout'
import { wrapper } from "../redux/store"
import WebInfo from "../sub_modules/share/model/webInfo"
import WebSocial from "../sub_modules/share/model/webSocial"
import { apiGetPageLayout } from "../utils/apis/pageLayoutApi"

const ErrorNotFound = (props: {
  webInfo?: WebInfo, webSocial?: WebSocial
}) => {
  return <Layout {...props}>
    <ErrorView message="Không tìm thấy trang" />
  </Layout>
}

export const getStaticProps = wrapper.getStaticProps(async () => {
  const { webInfo, webSocial } = await apiGetPageLayout();
  return {
    props: {
      webInfo, webSocial
    }
  }
})

export default ErrorNotFound;
