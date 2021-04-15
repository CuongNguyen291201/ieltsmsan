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
import { HomeCategory } from '../custom-types';
import { wrapper } from '../redux/store';
import { apiGetCategories } from '../utils/apis/categoryApi';

const isServer = typeof window === 'undefined'
const WOW = !isServer ? require('wow.js') : null

const Index = (props: { homeCategories: HomeCategory[] }) => {
  useEffect(() => {
    new WOW().init();
  }, [])

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
    </Layout>
  )
}

export default Index;

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async () => {
  const { data, status } = await apiGetCategories();
  const homeCategories = status === 0 ? data : [];
  return {
    props: { homeCategories }
  }
});
