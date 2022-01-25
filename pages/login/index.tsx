import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import Layout from '../../components/Layout';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import LoginForm from '../../sub_modules/common/components/auth/LoginForm';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import { UserInfo } from '../../sub_modules/share/model/user';
import { ROUTER_LOGIN } from '../../utils/router';

const Login = (props?: { userInfo: UserInfo }) => {
    const { userInfo } = props;
    const router = useRouter();
    useEffect(() => {
        if (!!userInfo) router.push("/")
    }, []);
    
    return (
        <Layout>
            <Breadcrumb items={[{ name: 'Đăng nhập', slug: ROUTER_LOGIN }]} />
            <LoginForm className="auth-ui" mainBgrColor="#19CE7A" mainTextColor="#fff" />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, req }) => {
    const userInfo = await getUserFromToken(req);
    if (userInfo) {
        store.dispatch(loginSuccessAction(userInfo));
    }
    return { props: { userInfo } }
})

export default Login;