import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { wrapper } from '../../redux/store';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import { removeCookie, TOKEN } from '../../sub_modules/common/utils/cookie';
import { GetServerSideProps } from 'next';
const DocumentUI = dynamic(() => import('../../sub_modules/document/src/App'), { ssr: false });
const ROOT_DOCUMENT_CATEGORY_ID = "60d147b2de1984563685542b";


const DocumentPage = () => {
    // useEffect(() => {
    //     console.log("isServer", !(typeof window === 'undefined'));
    // }, [])
    const { currentUser } = useSelector((state: any) => state.userReducer);

    return (
        <DocumentUI rootDocumentId={ROOT_DOCUMENT_CATEGORY_ID} />
        // <div suppressHydrationWarning>
        //     {typeof window === 'undefined' ? null : <DocumentUI rootDocumentId={ROOT_DOCUMENT_CATEGORY_ID} />}
        // </div>
    )
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