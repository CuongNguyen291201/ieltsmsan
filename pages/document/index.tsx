import React, { useEffect } from 'react';
import { Header } from '../../components/Document/Header'
import MainHeader from '../../components/MainHeader';
import Layout from '../../components/Layout';
import dynamic from 'next/dynamic';
// const DocumentUI = dynamic(() => import('../../sub_modules/document/src/App'), { ssr: false });
const ROOT_DOCUMENT_CATEGORY_ID = "60d147b2de1984563685542b";
import DocumentUI from '../../sub_modules/document/src/App';
const DocumentPage = () => {
    useEffect(() => {
        console.log("isServer", !(typeof window === 'undefined'));
    }, [])
    return (
        <div suppressHydrationWarning>
            {(typeof window === 'undefined') ? null : <DocumentUI rootDocumentId={ROOT_DOCUMENT_CATEGORY_ID} />}
        </div>
    )
    return (
        <DocumentUI
            rootDocumentId={ROOT_DOCUMENT_CATEGORY_ID}
        />);
};

export default DocumentPage;