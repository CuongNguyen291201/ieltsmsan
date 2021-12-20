import { GetServerSideProps } from 'next';
import React from 'react';
import Layout from '../../components/Layout';
import NewsView from '../../components/NewsView';
import ReplyComment from '../../components/ReplyComment';
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
import { apiWebInfo } from '../../utils/apis/webInfoApi';
import { apiWebSocial } from '../../utils/apis/webSocial';
import { getCategorySlug, NEWS_ID_PREFIX, ROUTER_NOT_FOUND } from '../../utils/router';

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
    [PAGE_REPLY_COMMENT]: <ReplyComment category={category} childCategories={childCategories} />,
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
  const { webInfo } = await apiWebInfo({ serverSide: true });
  const webSocial = await apiWebSocial(true);

  if (slugs.length === 1) {
    const routePath = slugs[0];
    const items = routePath.split('-');
    const [id] = items.slice(-1);
    const type = Number(...items.slice(-2, -1));
    const slug = items.slice(0, -2).join('-');

    if (!id || !slug) {
      res.writeHead(302, { Location: ROUTER_NOT_FOUND }).end();
      return;
    }


    if (id.startsWith(NEWS_ID_PREFIX)) {
      const newsId = id.slice(NEWS_ID_PREFIX.length);
      const news: News = await apiGetNewsById(newsId, true);
      if (!news) {
        res.writeHead(302, { Location: ROUTER_NOT_FOUND }).end();
        return;
      }
      return {
        props: {
          type: PAGE_NEWS_DETAIL,
          news,
          webInfo,
          webSocial,
          robot: news.metaRobot,
          title: news.title,
          description: news.description,
          canonicalSlug: `${news.slug}-${NEWS_ID_PREFIX}${newsId}`,
          keyword: news.keyWord
        }
      }
    }

    if (type === PAGE_CATEGORY_DETAIL) {
      const [category, childCategories] = await Promise.all([apiGetCategoryById({ categoryId: id, serverSide: true }), apiGetCategoriesByParent({ parentId: id, serverSide: true })]);

      store.dispatch(setCurrentCategoryAction(category));
      return {
        props: {
          id, type, slug, category, childCategories, webInfo, webSocial,
          title: category?.titleSEO, description: category?.descriptionSeo,
          robot: META_ROBOT_INDEX_FOLLOW, canonicalSlug: category ? getCategorySlug({ category }) : ''
        }
      }
    } else if (type === PAGE_REPLY_COMMENT) {
      return {
        props: { id, slug, type, webInfo, webSocial }
      }
    }
    res.writeHead(302, { Location: ROUTER_NOT_FOUND }).end();
    return;
  }
});

export default Slug;
