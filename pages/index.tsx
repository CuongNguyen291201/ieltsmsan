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
import { apiWebInfo } from '../utils/apis/webInfoApi';
import WebInfo from '../sub_modules/share/model/webInfo';
import WebSeo from '../sub_modules/share/model/webSeo';
import WebSocial from '../sub_modules/share/model/webSocial';
import { apiWebSocial } from '../utils/apis/webSocial';

const Index = (props: { homeCategories: _Category[]; webInfo?: WebInfo; webSeo?: WebSeo; webSocial?: WebSocial }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const WOW = require('wow.js');
      new WOW().init();
    }
  }, [typeof window]);
  return (
    <Layout webInfo={props.webInfo} webSeo={props.webSeo} webSocial={props.webSocial}>
      <div style={{boxShadow:'0px 0px 15px rgba(95, 73, 118, 0.15)', backgroundColor:'white'}}>
      <HomeBanner />
      <HomeCategorySection categories={props.homeCategories} />
      <StudentFeeling></StudentFeeling>
      <HomeWhy></HomeWhy>
      <HomeUtility></HomeUtility>
      <HomeNews></HomeNews>
      </div>
    </Layout>
  )
}

export default Index;

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, req, res }) => {
  const userInfo = await getUserFromToken(req);
  if (userInfo) {
    store.dispatch(loginSuccessAction(userInfo));
  }

  const { data, status } = await apiGetCategories();
  const { webInfo, webSeo } = await apiWebInfo();
  const webSocial = await apiWebSocial();

  const homeCategories = status === 0 ? data : [];

  return {
    props: { homeCategories, webInfo, webSeo, webSocial }
  }
});
