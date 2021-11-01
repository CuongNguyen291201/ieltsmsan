import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { wrapper } from '../../redux/store';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import { removeCookie, TOKEN } from '../../sub_modules/common/utils/cookie';
import { GetServerSideProps } from 'next';
// const DocumentUI = dynamic(() => import('../../sub_modules/document/src/App'), { ssr: false });
const LiveGamePageUI = dynamic(() => import('../../sub_modules/live-game/src/index'), { ssr: false });

const LiveGamePage = () => {
    return (
        <div suppressHydrationWarning>
            {typeof window === 'undefined' ? null : <LiveGamePageUI />}
        </div>
    )
};
export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, req }) => {
    const userInfo = await getUserFromToken(req);
    if (userInfo) {
        store.dispatch(loginSuccessAction(userInfo));
    }
})
export default LiveGamePage;