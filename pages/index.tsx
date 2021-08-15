import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'wow.js/css/libs/animate.css';
import HomeBanner from '../components/HomeBanner';
import HomeCategorySection from '../components/HomeCategorySection';
import HomeNews from '../components/HomeNews';
import HomeUtility from '../components/HomeUtility';
import HomeWhy from '../components/HomeWhy';
import Layout from '../components/Layout';
import MainHeader from '../components/MainHeader';
import MainMenu from '../components/MainMenu';
import StudentFeeling from '../components/StudentFeeling';
import { _Category } from '../custom-types';
import { wrapper } from '../redux/store';
import { apiGetCategories } from '../utils/apis/categoryApi';
import Footer from '../components/Footer';
import { getUserFromToken } from '../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../sub_modules/common/redux/actions/userActions';
import { removeCookie, TOKEN } from '../sub_modules/common/utils/cookie';

const Index = (props: { homeCategories: _Category[] }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const WOW = require('wow.js');
      new WOW().init();
    }
  }, [typeof window]);

  return (
    <Layout>
      <MainHeader />
      <MainMenu />
      <HomeBanner />
      <HomeCategorySection categories={props.homeCategories} />
      <StudentFeeling></StudentFeeling>
      <HomeWhy></HomeWhy>
      <HomeUtility></HomeUtility>
      <HomeNews></HomeNews>
      <Footer />
    </Layout>
  )
}

export default Index;

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, req }) => {
  const userInfo = await getUserFromToken(req);
  if (userInfo) {
    store.dispatch(loginSuccessAction(userInfo));
  } else {
    removeCookie(TOKEN);
  }
  const { data, status } = await apiGetCategories();
  const homeCategories = status === 0 ? data : [];
  return {
    props: { homeCategories }
  }
});
