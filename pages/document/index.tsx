import React from 'react';
import { Header } from '../../components/Document/Header'
import MainHeader from '../../components/MainHeader';
import Layout from '../../components/Layout';
import dynamic from 'next/dynamic';
const DocumentUI = dynamic(() => import('../../sub_modules/document/src/App'), { ssr: false });
const ROOT_DOCUMENT_CATEGORY_ID = "60d147b2de1984563685542b";
const DocumentPage = () => {
    return (
        <DocumentUI
            rootDocumentId={ROOT_DOCUMENT_CATEGORY_ID}
        />);
    return (
        <Layout>
            <MainHeader />
        </Layout>
    );
};

export default DocumentPage;