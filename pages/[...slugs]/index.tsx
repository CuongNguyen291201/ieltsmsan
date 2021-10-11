import { GetServerSideProps } from 'next';
import React, { useMemo } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import CourseDetail from '../../components/CourseDetail';
import Layout from '../../components/Layout';
import NewsView from '../../components/NewsView';
import ReplyComment from '../../components/ReplyComment';
import RootCategoryDetail from '../../components/RootCategoryDetail';
import TopicDetail from '../../components/TopicDetail';
import { _Category, _Topic } from '../../custom-types';
import {
  PAGE_CATEGORY_DETAIL,
  PAGE_COURSE_DETAIL, PAGE_ERROR, PAGE_NEWS_DETAIL, PAGE_NOT_FOUND, PAGE_REPLY_COMMENT, PAGE_TOPIC_DETAIL
} from '../../custom-types/PageType';
import { setCurrentCategoryAction } from '../../redux/actions/category.actions';
import { setCurrentCourseAction } from '../../redux/actions/course.actions';
import { setCurrrentTopicAction } from '../../redux/actions/topic.action';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import { response_status } from '../../sub_modules/share/api_services/http_status';
import { Course } from '../../sub_modules/share/model/courses';
import News from '../../sub_modules/share/model/news';
import Topic from '../../sub_modules/share/model/topic';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { apiGetCategoriesByParent, apiGetCategoryById, apiGetCategoryBySlug } from '../../utils/apis/categoryApi';
import { apiGetCourseById } from '../../utils/apis/courseApi';
import { apiGetNewsById } from '../../utils/apis/newsApi';
import { apiGetTopicById } from '../../utils/apis/topicApi';
import { apiWebInfo } from '../../utils/apis/webInfoApi';
import { apiWebSocial } from '../../utils/apis/webSocial';
import { getCategorySlug, getCoursePageSlug, getTopicPageSlug, NEWS_ID_PREFIX, ROUTER_ERROR, ROUTER_NOT_FOUND } from '../../utils/router';

type SlugTypes = {
  slug: string;
  type: number;
  id: string;
  category?: _Category;
  childCategories?: _Category[];
  course?: Course;
  topic?: Topic;
  webInfo?: WebInfo;
  webSocial?: WebSocial;
  news?: News;
}

const Slug = (props: SlugTypes) => {
  const { id, slug, type = PAGE_NOT_FOUND } = props;
  const mapTypePage = {
    [PAGE_CATEGORY_DETAIL]: <RootCategoryDetail category={props.category} childCategories={props.childCategories} />,
    [PAGE_COURSE_DETAIL]: <CourseDetail course={props.course} webInfo={props.webInfo} />,
    [PAGE_TOPIC_DETAIL]: <TopicDetail course={props.course} topic={props.topic} webInfo={props.webInfo} />,
    [PAGE_REPLY_COMMENT]: <ReplyComment category={props.category} childCategories={props.childCategories} />,
    [PAGE_NEWS_DETAIL]: <NewsView news={props.news} />
  }

  const breadcrumbItems = useMemo(() => {
    const items: { name: string; slug?: string; }[] = [];
    if (type === PAGE_CATEGORY_DETAIL) {
      const { category } = props;
      items.push({ name: category.name, slug: getCategorySlug({ category }) });
    } else if (type === PAGE_COURSE_DETAIL) {
      const { category, course } = props;
      if (category) items.push({ name: category.name, slug: getCategorySlug({ category }) });
      items.push({ name: course.name, slug: getCoursePageSlug({ category, course }) });
    } else if (type === PAGE_TOPIC_DETAIL) {
      const { category, course, topic } = props;
      items.push({ name: category.name, slug: getCategorySlug({ category }) });
      items.push(
        { name: course.name, slug: getCoursePageSlug({ category, course }) },
        { name: topic.name, slug: getTopicPageSlug({ category, topic }) }
      );
    }
    return items;
  }, [type]);

  return (
    <Layout
      addMathJax={type === PAGE_TOPIC_DETAIL}
      hideHeader={type === PAGE_COURSE_DETAIL || type === PAGE_TOPIC_DETAIL}
      hideMenu={type === PAGE_REPLY_COMMENT || type === PAGE_COURSE_DETAIL || type === PAGE_TOPIC_DETAIL}
      hideFooter={type === PAGE_REPLY_COMMENT}
      webInfo={props.webInfo}
      webSocial={props.webSocial}
    >
      {type !== PAGE_ERROR && type !== PAGE_ERROR && type !== PAGE_REPLY_COMMENT && type !== PAGE_NEWS_DETAIL && type !== PAGE_COURSE_DETAIL && type !== PAGE_TOPIC_DETAIL && <Breadcrumb items={breadcrumbItems} />}
      {mapTypePage[type ?? PAGE_ERROR]}
    </Layout>
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
      } else if (type === PAGE_COURSE_DETAIL) {
        store.dispatch(setCurrentCourseAction(null, true));
        const course = await apiGetCourseById(id);
        store.dispatch(setCurrentCourseAction(course));
        return {
          props: {
            id, type, slug, course, webInfo, webSocial
          }
        }
      }
      return res.writeHead(302, { Location: ROUTER_NOT_FOUND }).end();
    } else {
      const [categorySlug, items] = slugs as string[];
      const [id] = items.split('-').slice(-1);
      const type = Number(...items.split('-').slice(-2, -1));
      const slug = items.split('-').slice(0, -2).join('-');
      const category = await apiGetCategoryBySlug(categorySlug);
      store.dispatch(setCurrentCategoryAction(category));

      if (!id || !slug) return res.writeHead(302, { Location: ROUTER_NOT_FOUND }).end();


      let course: Course | null = null;
      let topic: _Topic | null = null;

      if (type === PAGE_COURSE_DETAIL) {
        store.dispatch(setCurrentCourseAction(null, true));
        course = await apiGetCourseById(id);
        store.dispatch(setCurrentCourseAction(course));
      } else if (type === PAGE_TOPIC_DETAIL) {
        store.dispatch(setCurrrentTopicAction(null, true));
        topic = await apiGetTopicById(id);
        course = topic.course;
        store.dispatch(setCurrrentTopicAction(topic));
      }
      return {
        props: {
          id, slug, type, category, course, topic, webInfo, webSocial
        }
      }
    }
  } catch (e) {
    console.log('Internal Server Error', e);
    return res.writeHead(302, { Location: ROUTER_ERROR }).end();
  }
});

export default Slug;
