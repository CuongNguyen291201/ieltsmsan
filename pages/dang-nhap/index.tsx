import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import Layout from '../../components/Layout';
import useAuth from "../../hooks/useAuth";
import { getWebMenuAction } from "../../redux/actions/menu.action";
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import LoginForm from '../../sub_modules/common/components/auth/LoginForm';
import WebInfo from "../../sub_modules/share/model/webInfo";
import WebSeo from "../../sub_modules/share/model/webSeo";
import WebSocial from "../../sub_modules/share/model/webSocial";
import { apiGetPageLayout } from "../../utils/apis/pageLayoutApi";
import { ROUTER_LOGIN, ROUTER_REGISTER } from '../../utils/router';

const Login = (props: {
  webInfo?: WebInfo; webSeo?: WebSeo; webSocial?: WebSocial
}) => {
    const router = useRouter();
    useAuth({ redirect: "/" });
    return (
        <Layout useDefaultBackground {...props}>
            <div style={{ background: "#EBF0FC" }}>
                <div className="container">
                    <Breadcrumb items={[{ name: 'Đăng nhập', slug: ROUTER_LOGIN }]} />
                </div>
            </div>
            <div className="container" style={{ display: "flex", justifyContent: "center" }}>
                <LoginForm mainBgrColor="#19CE7A" mainTextColor="#fff" 
                    onLoginSuccess={() => {
                        const returnUri = router.query.return_uri as string;
                        router.replace(returnUri || '/')
                    }}
                    onClickRegister={() => {
                    const query = router.query;
                    router.push({
                        pathname: ROUTER_REGISTER,
                        query
                    }, undefined, { shallow: true, scroll: true })
                }} />
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, req }) => {
  const { webMenuItems, ...layout } = await apiGetPageLayout({ menu: true });
  store.dispatch(getWebMenuAction(webMenuItems));
  return {
    props: {
      ...layout
    }
  }
});

export default Login;