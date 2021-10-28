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
import { setCurrentCategoryAction } from '../../redux/actions/category.actions';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import { response_status } from '../../sub_modules/share/api_services/http_status';
import News from '../../sub_modules/share/model/news';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { apiGetCategoriesByParent, apiGetCategoryById } from '../../utils/apis/categoryApi';
import { apiGetNewsById } from '../../utils/apis/newsApi';
import { apiWebInfo } from '../../utils/apis/webInfoApi';
import { apiWebSocial } from '../../utils/apis/webSocial';
import { NEWS_ID_PREFIX, ROUTER_ERROR, ROUTER_NOT_FOUND } from '../../utils/router';

type SlugTypes = {
  slug: string;
  type: number;
  id: string;
  category?: _Category;
  childCategories?: _Category[];
  webInfo?: WebInfo;
  webSocial?: WebSocial;
  news?: News;
}

const Slug = (props: SlugTypes) => {
  const { id, slug, type = PAGE_NOT_FOUND } = props;
  const mapTypePage = {
    [PAGE_CATEGORY_DETAIL]: <RootCategoryDetail category={props.category} childCategories={props.childCategories} />,
    [PAGE_REPLY_COMMENT]: <ReplyComment category={props.category} childCategories={props.childCategories} />,
    [PAGE_NEWS_DETAIL]: <NewsView news={props.news} />
  }

  return (
    <div>
        <Layout
          hideMenu={type === PAGE_REPLY_COMMENT}
          hideFooter={type === PAGE_REPLY_COMMENT}
          webInfo={props.webInfo}
          webSocial={props.webSocial}
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
  try {
    const { webInfo } = await apiWebInfo();
    const webSocial = await apiWebSocial();

    if (slugs.length === 1) {
      const routePath = slugs[0];
      const items = routePath.split('-');
      const [id] = items.slice(-1);
      const type = Number(...items.slice(-2, -1));
      const slug = items.slice(0, -2).join('-');

      if (!id || !slug) return res.writeHead(302, { Location: ROUTER_NOT_FOUND }).end();

      if (id.startsWith(NEWS_ID_PREFIX)) {
        const newsId = id.slice(NEWS_ID_PREFIX.length);
        const news = await apiGetNewsById(newsId);
        if (!news) return res.writeHead(302, { Location: ROUTER_NOT_FOUND }).end();
        return {
          props: {
            type: PAGE_NEWS_DETAIL,
            news,
            webInfo, webSocial
          }
        }
      }

      if (type === PAGE_CATEGORY_DETAIL) {
        let category: _Category = null;
        let childCategories: _Category[] = [];
        const [categoryRes, childCategoriesRes] = await Promise.all([apiGetCategoryById(id), apiGetCategoriesByParent(id)]);
        if (categoryRes.status === response_status.success && childCategoriesRes.status === response_status.success) {
          category = categoryRes.data;
          childCategories = childCategoriesRes.data;
        }
        store.dispatch(setCurrentCategoryAction(category));
        return {
          props: {
            id, type, slug, category, childCategories, webInfo, webSocial
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
  } catch (e) {
    console.log('Internal Server Error', e);
    res.writeHead(302, { Location: ROUTER_ERROR }).end();
    return;
  }
});

export default Slug;
