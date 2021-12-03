import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import { wrapper } from '../../redux/store';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSeo from '../../sub_modules/share/model/webSeo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { getUserFromToken } from "../../utils/apis/auth";
import { apiWebInfo } from '../../utils/apis/webInfoApi';
import { apiWebSocial } from '../../utils/apis/webSocial';

const TransactionHistoryView = dynamic(() => import('../../components/TransactionHistoryView'), { ssr: false });

const TransactionHistoryPage = (props: { webInfo: WebInfo, webSeo: WebSeo, webSocial: WebSocial }) => {
  return (
    <Layout {...props} webInfo={{ ...props.webInfo, name: `Lịch sử giao dịch | ${props.webInfo?.name}` }}>
      <TransactionHistoryView />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req }) => {
  const userInfo = await getUserFromToken(req);
  if (userInfo) store.dispatch(loginSuccessAction(userInfo));
  const { webInfo, webSeo } = await apiWebInfo();
  const webSocial = await apiWebSocial();

  return { props: { webInfo, webSeo, webSocial } }
});

export default TransactionHistoryPage;
