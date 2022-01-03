import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Breadcrumb from "../../components/Breadcrumb";
import Layout from '../../components/Layout';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { apiGetPageLayout } from "../../utils/apis/pageLayoutApi";
import { ROUTER_TRANSACTION_HISTORY } from "../../utils/router";

const TransactionHistoryView = dynamic(() => import('../../components/TransactionHistoryView'), { ssr: false });

const TransactionHistoryPage = (props: { webInfo: WebInfo, webSocial: WebSocial }) => {
  return (
    <Layout {...props} webInfo={{ ...props.webInfo, name: `Lịch sử giao dịch | ${props.webInfo?.name}` }}>
      <Breadcrumb items={[{ name: 'Lịch sử giao dịch', slug: ROUTER_TRANSACTION_HISTORY }]} />
      <TransactionHistoryView />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req }) => {
  const userInfo = await getUserFromToken(req);
  if (userInfo) store.dispatch(loginSuccessAction(userInfo));
  const { webInfo, webSocial } = await apiGetPageLayout();


  return { props: { webInfo, webSocial } }
});

export default TransactionHistoryPage;
