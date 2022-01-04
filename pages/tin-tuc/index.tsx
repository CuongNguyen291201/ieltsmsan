import { GetServerSideProps } from 'next';
import React from "react";
// import Newright from '../../public/hvvv/news-right.jpeg';
import Layout from '../../components/Layout';
import NewsCategoryView from '../../components/NewsCategoryView';
import { getWebMenuAction } from "../../redux/actions/menu.action";
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import { META_ROBOT_NO_INDEX_NO_FOLLOW } from "../../sub_modules/share/constraint";
import CategoryNews from '../../sub_modules/share/model/categoryNews';
import News from '../../sub_modules/share/model/news';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { apiFullNews, apiNewsCategories } from "../../utils/apis/newsApi";
import { apiGetPageLayout } from "../../utils/apis/pageLayoutApi";
import { ROUTER_NEWS } from '../../utils/router';

const NEWS_LIMIT = 5;

const NewsPage = (props: { webInfo?: WebInfo, webSocial?: WebSocial; newsList?: News[]; totalNews?: number; categoryNews?: CategoryNews[] }) => {
  const { categoryNews, newsList, totalNews, ...webSettings } = props;
  return (
    <Layout {...webSettings} canonicalSlug={ROUTER_NEWS} robot={META_ROBOT_NO_INDEX_NO_FOLLOW} title="Tin tức" useDefaultBackground>
      <NewsCategoryView
        categoryNews={categoryNews}
        newsList={newsList}
        totalNews={totalNews}
        newsLimit={NEWS_LIMIT}
      />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, req, res, query }) => {
  const userInfo = await getUserFromToken(req);
  if (userInfo) {
    store.dispatch(loginSuccessAction(userInfo));
  }
  const { webInfo, webSocial, webMenuItems } = await apiGetPageLayout({ menu: true });
  store.dispatch(getWebMenuAction(webMenuItems));
  const pageQuery = parseInt((query.page || '1') as string);
  const skip = (isNaN(pageQuery) || pageQuery <= 1) ? 0 : (pageQuery - 1) * NEWS_LIMIT
  const { data: newsList, total: totalNews } = await apiFullNews({ skip, limit: NEWS_LIMIT, serverSide: true });
  const { data: { categories: categoryNews } } = await apiNewsCategories({ serverSide: true });

  return {
    props: {
      webInfo,
      webSocial,
      newsList,
      totalNews,
      categoryNews
    }
  }
});

export default NewsPage;