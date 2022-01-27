import { GetServerSideProps } from 'next';
import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import Layout from '../../components/Layout';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import RegisterForm from '../../sub_modules/common/components/auth/RegisterForm';
import { ROUTER_REGISTER } from '../../utils/router';

const Register = () => {
    return (
        <Layout>
            <Breadcrumb items={[{ name: 'Đăng ký', slug: ROUTER_REGISTER }]} />
            <div className="container">
                <RegisterForm mainBgrColor="#19CE7A" mainTextColor="#fff" />
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

export default Register;
