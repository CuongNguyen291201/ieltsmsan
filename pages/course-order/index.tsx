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

const CourseOrderPage = () => {
    return (
        <Layout>
            <Breadcrumb items={[{ name: 'Giỏ hàng', slug: 'course-order' }]} />
            <CourseOder />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req }) => {
    const userInfo = await getUserFromToken(req);
    if (userInfo) store.dispatch(loginSuccessAction(userInfo));
});

export default CourseOrderPage;