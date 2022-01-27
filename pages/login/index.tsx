import { GetServerSideProps } from 'next';
import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import Layout from '../../components/Layout';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import LoginForm from '../../sub_modules/common/components/auth/LoginForm';
import { ROUTER_LOGIN } from '../../utils/router';

const Login = () => {
    return (
        <Layout>
            <Breadcrumb items={[{ name: 'Đăng nhập', slug: ROUTER_LOGIN }]} />
            <div className="container">
                <LoginForm mainBgrColor="#19CE7A" mainTextColor="#fff" />
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, req }) => {
    const userInfo = await getUserFromToken(req);
    if (!!userInfo) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }
})

export default Login;