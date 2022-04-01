import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import Layout from '../../components/Layout';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import RegisterForm from '../../sub_modules/common/components/auth/RegisterForm';
import { ROUTER_LOGIN, ROUTER_REGISTER } from '../../utils/router';

const Register = () => {
    const router = useRouter();
    return (
        <Layout>
            <div style={{ background: "#EBF0FC" }}>
                <div className="container">
                    <Breadcrumb items={[{ name: 'Đăng ký', slug: ROUTER_REGISTER }]} />
                </div>
            </div>
            <div className="container" style={{ display: "flex", justifyContent: "center" }}>
                <RegisterForm mainBgrColor="#19CE7A" mainTextColor="#fff" enablePhone onClickLogin={() => {
                    router.push(ROUTER_LOGIN, ROUTER_LOGIN, { shallow: true, scroll: true })
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

export default Register;
