import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../../../components/Layout';
import MainMenu from '../../../components/MainMenu';
import { wrapper } from '../../../redux/store';
import { getUserFromToken } from '../../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../../sub_modules/common/redux/actions/userActions';
import EventExam from '../../../components/Event/EventExam';
import { apiGetTopicById } from '../../../utils/apis/topicApi';
import { setCurrrentTopicAction } from '../../../redux/actions/topic.action';
import useAuth from "../../../hooks/useAuth";

const ExamPage = () => {
    useAuth();
    return (
        <Layout>
            <MainMenu />
            <EventExam />
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req }) => {
    const { topicId } = query;
    const currentTopic = await apiGetTopicById({ topicId: topicId as string, serverSide: true });
    if (currentTopic) store.dispatch(setCurrrentTopicAction(currentTopic));
});

export default ExamPage
