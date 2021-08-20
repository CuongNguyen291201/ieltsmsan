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
import CoursePay from '../../components/CoursePay';
import { ROUTER_PAYMENT } from '../../utils/router';
import { apiWebInfo } from '../../utils/apis/webInfoApi';
import { apiWebSocial } from '../../utils/apis/webSocial';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSeo from '../../sub_modules/share/model/webSeo';
import WebSocial from '../../sub_modules/share/model/webSocial';

const CoursePayPage = (props: { webInfo: WebInfo, webSeo: WebSeo, webSocial: WebSocial }) => {
    return (
        <Layout {...props}>
            <Breadcrumb items={[{ name: 'Thanh toán', slug: ROUTER_PAYMENT }]} />
            <CoursePay />
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

export default CoursePayPage;