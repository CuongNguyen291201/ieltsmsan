import { GetServerSideProps } from 'next';
import dynamic from "next/dynamic";
import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import Layout from '../../components/Layout';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSeo from '../../sub_modules/share/model/webSeo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { apiWebInfo } from '../../utils/apis/webInfoApi';
import { apiWebSocial } from '../../utils/apis/webSocial';
import { ROUTER_CART } from '../../utils/router';

const CartPageView = dynamic(() => import('../../components/CartPageView'));

const CartPage = (props: { webInfo?: WebInfo, webSeo?: WebSeo, webSocial?: WebSocial }) => {
    return (
        <Layout {...props}>
            <Breadcrumb items={[{ name: 'Giỏ hàng', slug: ROUTER_CART }]} />
            <CartPageView />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req }) => {
    const userInfo = await getUserFromToken(req);
    if (userInfo) store.dispatch(loginSuccessAction(userInfo));
    const { webInfo, webSeo } = await apiWebInfo();
    const webSocial = await apiWebSocial();

    return { props: { webInfo, webSeo, webSocial } }
});

export default CartPage;