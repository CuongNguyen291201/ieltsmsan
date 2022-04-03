import { GetServerSideProps } from 'next';
import Layout from '../../../components/Layout';
import NewsCategoryView from '../../../components/NewsCategoryView';
import useAuth from "../../../hooks/useAuth";
import { getWebMenuAction } from "../../../redux/actions/menu.action";
import { wrapper } from '../../../redux/store';
import { META_ROBOT_NO_INDEX_NO_FOLLOW } from "../../../sub_modules/share/constraint";
import CategoryNews from '../../../sub_modules/share/model/categoryNews';
import News from '../../../sub_modules/share/model/news';
import WebInfo from '../../../sub_modules/share/model/webInfo';
import WebSocial from '../../../sub_modules/share/model/webSocial';
import { apiGetNewsByCategorySlug, apiNewsCategories } from '../../../utils/apis/newsApi';
import { apiGetPageLayout } from "../../../utils/apis/pageLayoutApi";
import { ROUTER_NEWS } from '../../../utils/router';

const NEWS_LIMIT = 5;

const CategoryNewsPage = (props: { webInfo?: WebInfo, webSocial?: WebSocial; newsList?: News[]; totalNews?: number; categoryNews?: CategoryNews[]; category: CategoryNews }) => {
  const { categoryNews, newsList, totalNews, category, ...webSettings } = props;
  useAuth();
  return <Layout {...webSettings} robot={META_ROBOT_NO_INDEX_NO_FOLLOW}>
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
  const { webInfo, webSocial, webMenuItems } = await apiGetPageLayout({ menu: true });
  store.dispatch(getWebMenuAction(webMenuItems));

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
      webInfo,
      webSocial,
      newsList,
      totalNews,
      categoryNews,
      category: categoryNews.find(({ slug }) => slug === categorySlug),
      canonicalSlug: `${ROUTER_NEWS}/${categorySlug}`
    }
  }
});

export default CategoryNewsPage;