import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { wrapper } from '../../redux/store';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import { removeCookie, TOKEN } from '../../sub_modules/common/utils/cookie';
import { GetServerSideProps } from 'next';
import { _Category } from '../../custom-types';
import { apiGetCategoryBySlug } from '../../utils/apis/categoryApi';
import Layout from '../../components/Layout';
import Breadcrumb from '../../components/Breadcrumb';
import { ROUTER_DOCUMENT } from '../../utils/router';
const DocumentUI = dynamic(() => import('../../sub_modules/document/src/App'), { ssr: false });

// const ROOT_DOCUMENT_CATEGORY_ID = "60d147b2de1984563685542b";
// // import DocumentUI from '../../sub_modules/document/src/App';
// // export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req }) => {
// //     const userInfo = await getUserFromToken(req);
// //     if (userInfo) store.dispatch(loginSuccessAction(userInfo));
// // });

const DocumentPage = () => {
    const [rootDocument, setRootDocument] = useState<_Category>();

    useEffect(() => {
        apiGetCategoryBySlug('tai-lieu')
            .then((category) => setRootDocument(category))
    }, []);
    return (
        <Layout hideFooter hideMenu>
            <Breadcrumb items={[{ name: "Tài liệu", slug: ROUTER_DOCUMENT }]} />
            {
                rootDocument
                    ? <DocumentUI rootDocumentId={rootDocument._id} />
                    : <></>

            }
        </Layout>
    )
    // <div suppressHydrationWarning>
    //     {typeof window === 'undefined' ? null : <DocumentUI rootDocumentId={ROOT_DOCUMENT_CATEGORY_ID} />}
    // </div>
};
export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, req }) => {
    const userInfo = await getUserFromToken(req);
    if (userInfo) {
        store.dispatch(loginSuccessAction(userInfo));
    } else {
        removeCookie(TOKEN);
    }
})
export default DocumentPage;