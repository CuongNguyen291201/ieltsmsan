import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Breadcrumb from "../../components/Breadcrumb";
import Layout from '../../components/Layout';
import useAuth from "../../hooks/useAuth";
import { getWebMenuAction } from "../../redux/actions/menu.action";
import { wrapper } from '../../redux/store';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { apiGetPageLayout } from "../../utils/apis/pageLayoutApi";
import { ROUTER_TRANSACTION_HISTORY } from "../../utils/router";

const TransactionHistoryView = dynamic(() => import('../../components/TransactionHistoryView'), { ssr: false });

const TransactionHistoryPage = (props: { webInfo: WebInfo, webSocial: WebSocial }) => {
  useAuth();
  return (
    <Layout {...props} webInfo={props.webInfo} title="Lịch sử giao dịch" useDefaultBackground>
      <div className="container">
        <Breadcrumb items={[{ name: 'Lịch sử giao dịch', slug: ROUTER_TRANSACTION_HISTORY }]} />
      </div>
      <TransactionHistoryView />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req }) => {
  const { webInfo, webSocial, webMenuItems } = await apiGetPageLayout({ menu:  true });
  store.dispatch(getWebMenuAction(webMenuItems));

  return { props: { webInfo, webSocial } }
});

export default TransactionHistoryPage;
