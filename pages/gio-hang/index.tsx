import { GetServerSideProps } from 'next';
import dynamic from "next/dynamic";
import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import Layout from '../../components/Layout';
import useAuth from "../../hooks/useAuth";
import { getWebMenuAction } from "../../redux/actions/menu.action";
import { wrapper } from '../../redux/store';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { apiGetPageLayout } from "../../utils/apis/pageLayoutApi";
import { ROUTER_CART } from '../../utils/router';

const CartPageView = dynamic(() => import('../../components/CartPageView'));

const CartPage = (props: { webInfo?: WebInfo, webSocial?: WebSocial }) => {
    useAuth()
    return (
        <Layout {...props} useDefaultBackground>
            <div className="container">
                <Breadcrumb items={[{ name: 'Giỏ hàng', slug: ROUTER_CART }]} />
                <CartPageView />
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req }) => {
    const { webInfo, webSocial, webMenuItems } = await apiGetPageLayout({ menu: true });
    store.dispatch(getWebMenuAction(webMenuItems));
    return { props: { webInfo, webSocial } }
});

export default CartPage;