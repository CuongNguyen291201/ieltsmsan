import { GetServerSideProps } from 'next';
import HomeCategorySection from '../components/HomeCategorySection';
import Layout from '../components/Layout';
import MainHeader from '../components/MainHeader';
import MainMenu from '../components/MainMenu';
import { HomeCategory } from '../custom-types';
import { wrapper } from '../redux/store';
import { apiGetCategories } from '../utils/apis/categoryApi';

const Index = (props: { homeCategories: HomeCategory[] }) => {
  return (
    <Layout>
      <MainHeader />
      <MainMenu />
      {/* <HomeBanner /> */}

      <HomeCategorySection categories={props.homeCategories} />

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
