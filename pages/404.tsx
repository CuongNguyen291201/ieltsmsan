import ErrorView from '../components/ErrorView'
import Layout from '../components/Layout'

export default () => <Layout hideHeader hideMenu hideFooter><ErrorView message="Không tìm thấy trang" /></Layout>