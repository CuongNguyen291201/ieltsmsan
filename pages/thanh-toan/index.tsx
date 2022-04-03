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
import { ROUTER_PAYMENT } from '../../utils/router';

const CoursePay = dynamic(() => import('../../components/CoursePay'), { ssr: false });

const CoursePayPage = (props: { webInfo: WebInfo, webSocial: WebSocial }) => {
    useAuth();
    return (
        <Layout {...props} useDefaultBackground>
            <div className="container">
                <Breadcrumb items={[{ name: 'Thanh toán', slug: ROUTER_PAYMENT }]} />
            </div>
            <CoursePay webInfo={props.webInfo} />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req }) => {
    const { webInfo, webSocial, webMenuItems } = await apiGetPageLayout({ menu: true });
    store.dispatch(getWebMenuAction(webMenuItems));

    return { props: { webInfo, webSocial } }
});

export default CoursePayPage;