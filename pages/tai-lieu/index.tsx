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
import { apiWebInfo } from '../../utils/apis/webInfoApi';
import { apiWebSocial } from '../../utils/apis/webSocial';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSeo from '../../sub_modules/share/model/webSeo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { apiGetPageLayout } from "../../utils/apis/pageLayoutApi";
const DocumentUI = dynamic(() => import('../../sub_modules/document/src/App'), { ssr: false });

// const ROOT_DOCUMENT_CATEGORY_ID = "60d147b2de1984563685542b";
// // import DocumentUI from '../../sub_modules/document/src/App';
// // export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req }) => {
// //     const userInfo = await getUserFromToken(req);
// //     if (userInfo) store.dispatch(loginSuccessAction(userInfo));
// // });

const DocumentPage = (props: { webInfo: WebInfo, webSeo: WebSeo, webSocial: WebSocial }) => {
    const [rootDocument, setRootDocument] = useState<_Category>();

    useEffect(() => {
        apiGetCategoryBySlug('tai-lieu')
            .then((category) => setRootDocument(category))
    }, []);
    return (
        <Layout {...props} hideFooter useDefaultBackground>
            {/* <Breadcrumb items={[{ name: "Tài liệu", slug: ROUTER_DOCUMENT }]} /> */}
            {
                rootDocument
                    ? <DocumentUI rootDocumentId={rootDocument._id}
                        rootDocumentRouter={ROUTER_DOCUMENT}
                    />
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
    }
    const { webInfo, webSocial } = await apiGetPageLayout();

    return { props: { webInfo, webSocial } }
})
export default DocumentPage;