import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link'
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import Layout from '../../../components/Layout';
import MainHeader from '../../../components/MainHeader';
import MainMenu from '../../../components/MainMenu';
import { wrapper } from '../../../redux/store';
import { getUserFromToken } from '../../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../../sub_modules/common/redux/actions/userActions';
import EventExam from '../../../components/Event/EventExam';

const ExamPage = () => {
    return (
        <Layout>
            <MainHeader />
            <MainMenu />
            <EventExam />
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req }) => {
    const userInfo = await getUserFromToken(req);
    if (userInfo) store.dispatch(loginSuccessAction(userInfo));
});

export default ExamPage
