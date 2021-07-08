import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../../../components/Layout';
import MainHeader from '../../../components/MainHeader';
import MainMenu from '../../../components/MainMenu';
import { wrapper } from '../../../redux/store';
import { getUserFromToken } from '../../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../../sub_modules/common/redux/actions/userActions';
import EventExam from '../../../components/Event/EventExam';
import { apiGetTopicById } from '../../../utils/apis/topicApi';
import { setCurrrentTopicAction } from '../../../redux/actions/topic.action';

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
    const { topicId } = query;
    const currentTopic = await apiGetTopicById(topicId as string);
    if (currentTopic) store.dispatch(setCurrrentTopicAction(currentTopic));
});

export default ExamPage
