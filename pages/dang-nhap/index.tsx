import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import Layout from '../../components/Layout';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import LoginForm from '../../sub_modules/common/components/auth/LoginForm';
import { ROUTER_LOGIN, ROUTER_REGISTER } from '../../utils/router';

const Login = () => {
    const router = useRouter();
    return (
        <Layout>
            <div style={{ background: "#EBF0FC" }}>
                <div className="container">
                    <Breadcrumb items={[{ name: 'Đăng nhập', slug: ROUTER_LOGIN }]} />
                </div>
            </div>
            <div className="container" style={{ display: "flex", justifyContent: "center" }}>
                <LoginForm mainBgrColor="#19CE7A" mainTextColor="#fff" onClickRegister={() => {
                    router.push(ROUTER_REGISTER, ROUTER_REGISTER, { shallow: true, scroll: true })
                }} />
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