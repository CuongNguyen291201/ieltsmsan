import React from 'react';
import { GetServerSideProps } from 'next';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import Footer from '../../components/Footer';
import Layout from '../../components/Layout';
import MainHeader from '../../components/MainHeader';
import MainMenu from '../../components/MainMenu';
import Breadcrumb from '../../components/Breadcrumb';
import CourseOder from '../../components/CourseOder';
import { ROUTER_CART } from '../../utils/router';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSeo from '../../sub_modules/share/model/webSeo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { apiWebInfo } from '../../utils/apis/webInfoApi';
import { apiWebSocial } from '../../utils/apis/webSocial';

const CourseOrderPage = (props: { webInfo?: WebInfo, webSeo?: WebSeo, webSocial?: WebSocial }) => {
    return (
        <Layout {...props}>
            <Breadcrumb items={[{ name: 'Giỏ hàng', slug: ROUTER_CART }]} />
            <CourseOder />
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

export default CourseOrderPage;