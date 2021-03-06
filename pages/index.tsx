import { GetServerSideProps } from 'next';
import { useRouter } from "next/router";
import { useEffect } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'wow.js/css/libs/animate.css';
import HomeCategorySection from '../components/HomeCategorySection';
// import HomeUtility from '../components/HomeUtility';
// import HomeWhy from '../components/HomeWhy';
import Layout from '../components/Layout';
import { _Category } from '../custom-types';
import useAuth from "../hooks/useAuth";
import { getWebMenuAction } from "../redux/actions/menu.action";
import { wrapper } from '../redux/store';
import { CATEGORY_POSITION_LANDING_PAGE } from '../sub_modules/share/constraint';
import WebInfo from '../sub_modules/share/model/webInfo';
import WebSeo from '../sub_modules/share/model/webSeo';
import WebSocial from '../sub_modules/share/model/webSocial';
import { apiGetAllCategoriesWithCourses } from '../utils/apis/categoryApi';
import { apiGetPageLayout } from "../utils/apis/pageLayoutApi";

const Index = (props: { homeCategories: _Category[]; webInfo?: WebInfo; webSeo?: WebSeo; webSocial?: WebSocial }) => {
  const router = useRouter();
  useAuth();
  useEffect(() => {
    if (router.isReady) {
      const WOW = require('wow.js');
      new WOW().init();
    }
  }, [router.isReady]);
  return (
    <Layout webInfo={props.webInfo} webSeo={props.webSeo} webSocial={props.webSocial} useDefaultBackground>
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
  // const { data, status } = await apiGetCategories();
  const homeCategories = await apiGetAllCategoriesWithCourses({ position: CATEGORY_POSITION_LANDING_PAGE, serverSide: true });
  const { webInfo, webSeo, webSocial, webMenuItems } = await apiGetPageLayout({ slug: '/', menu: true });
  store.dispatch(getWebMenuAction(webMenuItems));
  // const homeCategories = status === 0 ? data : [];

  return {
    props: { homeCategories, webInfo, webSeo, webSocial }
  }
});
