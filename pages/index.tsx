import { GetServerSideProps } from 'next';
import { useRouter } from "next/router";
import { useEffect } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'wow.js/css/libs/animate.css';
import HomeBanner from '../components/HomeBanner';
import HomeCategorySection from '../components/HomeCategorySection';
// import HomeUtility from '../components/HomeUtility';
// import HomeWhy from '../components/HomeWhy';
import Layout from '../components/Layout';
import { _Category } from '../custom-types';
import { wrapper } from '../redux/store';
import { getUserFromToken } from '../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../sub_modules/common/redux/actions/userActions';
import { CATEGORY_POSITION_LANDING_PAGE, CATEGORY_POSITION_MENU } from '../sub_modules/share/constraint';
import WebInfo from '../sub_modules/share/model/webInfo';
import WebSeo from '../sub_modules/share/model/webSeo';
import WebSocial from '../sub_modules/share/model/webSocial';
import { removeServerSideCookie } from "../utils";
import { apiGetCategories, apiGetAllCategoriesWithCourses } from '../utils/apis/categoryApi';
import { apiWebInfo } from '../utils/apis/webInfoApi';
import { apiWebSocial } from '../utils/apis/webSocial';

const Index = (props: { homeCategories: _Category[]; webInfo?: WebInfo; webSeo?: WebSeo; webSocial?: WebSocial }) => {
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      const WOW = require('wow.js');
      new WOW().init();
    }
  }, [router.isReady]);
  return (
    <Layout webInfo={props.webInfo} webSeo={props.webSeo} webSocial={props.webSocial}>
      {/* <div style={{ boxShadow: '0px 0px 15px rgba(95, 73, 118, 0.15)', backgroundColor: 'white' }}> */}
        {/* <HomeBanner /> */}
        <HomeCategorySection categories={props.homeCategories} />
        {/* <HomeWhy></HomeWhy> */}
        {/* <HomeUtility></HomeUtility> */}
      {/* </div> */}
    </Layout>
  )
}

export default Index;

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, req, res }) => {
  const userInfo = await getUserFromToken(req);
  if (userInfo) {
    store.dispatch(loginSuccessAction(userInfo));
  } else {
    removeServerSideCookie(res);
  }

  // const { data, status } = await apiGetCategories();
  const homeCategories = await apiGetAllCategoriesWithCourses({ limitCourses: 6, position: CATEGORY_POSITION_LANDING_PAGE, serverSide: true });
  const { webInfo, webSeo } = await apiWebInfo({ pageSlug: '/', serverSide: true });
  const webSocial = await apiWebSocial(true);

  // const homeCategories = status === 0 ? data : [];

  return {
    props: { homeCategories, webInfo, webSeo, webSocial }
  }
});
