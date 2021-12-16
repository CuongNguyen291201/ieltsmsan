import { GetServerSideProps } from 'next';
import Layout from '../../../components/Layout';
import NewsCategoryView from '../../../components/NewsCategoryView';
// import Newright from '../../public/hvvv/news-right.jpeg';
import { wrapper } from '../../../redux/store';
import { getUserFromToken } from '../../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../../sub_modules/common/redux/actions/userActions';
import { removeCookie, TOKEN } from '../../../sub_modules/common/utils/cookie';
import CategoryNews from '../../../sub_modules/share/model/categoryNews';
import News from '../../../sub_modules/share/model/news';
import WebInfo from '../../../sub_modules/share/model/webInfo';
import WebSeo from '../../../sub_modules/share/model/webSeo';
import WebSocial from '../../../sub_modules/share/model/webSocial';
import { apiGetNewsByCategorySlug, apiNewsCategories } from '../../../utils/apis/newsApi';
import { apiWebInfo } from '../../../utils/apis/webInfoApi';
import { apiWebSocial } from '../../../utils/apis/webSocial';
import { ROUTER_NEWS } from '../../../utils/router';

const NEWS_LIMIT = 5;

const CategoryNewsPage = (props: { webInfo?: WebInfo, webSeo?: WebSeo, webSocial?: WebSocial; newsList?: News[]; totalNews?: number; categoryNews?: CategoryNews[]; category: CategoryNews }) => {
  const { categoryNews, newsList, totalNews, category, ...webSettings } = props;
  return <Layout {...webSettings}>
    <NewsCategoryView
      categoryNews={categoryNews}
      newsList={newsList}
      totalNews={totalNews}
      newsLimit={NEWS_LIMIT}
      category={category}
    />
  </Layout>
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req, res }) => {
  const userInfo = await getUserFromToken(req);
  if (userInfo) {
    store.dispatch(loginSuccessAction(userInfo));
  }
  const webInfoRes = await apiWebInfo({ pageSlug: ROUTER_NEWS });
  const webSocial = await apiWebSocial();

  const categorySlug = query.categorySlug as string;
  const pageQuery = parseInt((query.page || '1') as string);
  const skip = (isNaN(pageQuery) || pageQuery <= 1) ? 0 : (pageQuery - 1) * NEWS_LIMIT;
  const { data: newsList, total: totalNews } = await apiGetNewsByCategorySlug({
    newsCategorySlug: categorySlug,
    offset: skip,
    limit: NEWS_LIMIT,
    serverSide: true
  });
  const { data: { categories: categoryNews } } = await apiNewsCategories({ serverSide: true });

  return {
    props: {
      webInfo: webInfoRes.webInfo,
      webSeo: webInfoRes.webSeo,
      webSocial,
      newsList,
      totalNews,
      categoryNews,
      category: categoryNews.find(({ slug }) => slug === categorySlug)
    }
  }
});

export default CategoryNewsPage;