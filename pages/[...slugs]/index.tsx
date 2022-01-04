import { GetServerSideProps } from 'next';
import React from 'react';
import Layout from '../../components/Layout';
import NewsView from '../../components/NewsView';
import RootCategoryDetail from '../../components/RootCategoryDetail';
import { _Category } from '../../custom-types';
import {
  PAGE_CATEGORY_DETAIL, PAGE_ERROR, PAGE_NEWS_DETAIL, PAGE_NOT_FOUND, PAGE_REPLY_COMMENT
} from '../../custom-types/PageType';
import SeoProps from "../../custom-types/SeoProps";
import { setCurrentCategoryAction } from '../../redux/actions/category.actions';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import { META_ROBOT_INDEX_FOLLOW } from "../../sub_modules/share/constraint";
import News from '../../sub_modules/share/model/news';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { apiGetCategoriesByParent, apiGetCategoryById } from '../../utils/apis/categoryApi';
import { apiGetNewsById } from '../../utils/apis/newsApi';
import { apiGetPageLayout } from "../../utils/apis/pageLayoutApi";
import { getCategorySlug, NEWS_ID_PREFIX } from '../../utils/router';

const CategorySlugRegex = RegExp(`([0-9A-Za-z-]+)-${PAGE_CATEGORY_DETAIL}-([0-9a-f]+)`);
const NewsSlugRegex = RegExp(`([0-9A-Za-z-]+)-${NEWS_ID_PREFIX}([0-9a-f]+)`);

type SlugTypes = {
  slug: string;
  type: number;
  id: string;
  category?: _Category;
  childCategories?: _Category[];
  webInfo?: WebInfo;
  webSocial?: WebSocial;
  news?: News;
} & SeoProps;

const Slug = (props: SlugTypes) => {
  const { id, slug, type = PAGE_NOT_FOUND, category, childCategories, webInfo, webSocial, news, ...seoProps } = props;
  const mapTypePage = {
    [PAGE_CATEGORY_DETAIL]: <RootCategoryDetail category={category} childCategories={childCategories} />,
    [PAGE_NEWS_DETAIL]: <NewsView news={news} />
  }

  return (
    <div>
      <Layout
        hideMenu={type === PAGE_REPLY_COMMENT}
        hideFooter={type === PAGE_REPLY_COMMENT}
        webInfo={webInfo}
        webSocial={webSocial}
        {...seoProps}
        useDefaultBackground
      >
        {mapTypePage[type ?? PAGE_ERROR]}
      </Layout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req, res }) => {
  const userInfo = await getUserFromToken(req);
  if (userInfo) store.dispatch(loginSuccessAction(userInfo));
  const slugs = query.slugs;
  const { webInfo, webSocial } = await apiGetPageLayout();

  if (slugs.length === 1) {
    const routePath: string = slugs[0];
    if (routePath.match(CategorySlugRegex)) {
      const { 1: slug, 2: id } = routePath.match(CategorySlugRegex);
      const [category, childCategories] = await Promise.all([apiGetCategoryById({ categoryId: id, serverSide: true }), apiGetCategoriesByParent({ parentId: id, serverSide: true })]);

      if (encodeURIComponent(category?.slug) === encodeURIComponent(slug)) {
        store.dispatch(setCurrentCategoryAction(category));
        return {
          props: {
            id, type: PAGE_CATEGORY_DETAIL, slug, category, childCategories, webInfo, webSocial,
            title: category?.titleSEO, description: category?.descriptionSeo,
            robot: META_ROBOT_INDEX_FOLLOW, canonicalSlug: category ? getCategorySlug({ category }) : ''
          }
        }
      }
    } else if (routePath.match(NewsSlugRegex)) {
      const { 1: slug, 2: id } = routePath.match(NewsSlugRegex);
      const news: News = await apiGetNewsById(id, true);
      if (encodeURIComponent(news.slug) === encodeURIComponent(slug)) {
        return {
          props: {
            type: PAGE_NEWS_DETAIL,
            news,
            webInfo,
            webSocial,
            robot: news.metaRobot,
            title: news.title,
            description: news.description,
            canonicalSlug: `${news.slug}-${NEWS_ID_PREFIX}${id}`,
            keyword: news.keyWord
          }
        }
      }
    }
  }
  return {
    notFound: true
  }
});

export default Slug;
