import React from 'react';
import { Header } from '../../components/Document/Header'
import MainHeader from '../../components/MainHeader';
import Layout from '../../components/Layout';

const Document = () => {
    return (
        <Layout>
            <MainHeader />
            <Header />
        </Layout>
    );
};

export default Document;