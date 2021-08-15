import { GetServerSideProps } from 'next';
import React, { useMemo } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import CourseDetail from '../../components/CourseDetail';
import ErrorView from '../../components/ErrorView';
import Footer from '../../components/Footer';
import Layout from '../../components/Layout';
import MainHeader from '../../components/MainHeader';
import MainMenu from '../../components/MainMenu';
import ReplyComment from '../../components/ReplyComment';
import RootCategoryDetail from '../../components/RootCategoryDetail';
import TopicDetail from '../../components/TopicDetail';
import { _Category, _Topic } from '../../custom-types';
import {
  PAGE_CATEGORY_DETAIL,
  PAGE_COURSE_DETAIL, PAGE_ERROR, PAGE_NOT_FOUND, PAGE_REPLY_COMMENT, PAGE_TOPIC_DETAIL
} from '../../custom-types/PageType';
import { setCurrentCourseAction } from '../../redux/actions/course.actions';
import { setCurrrentTopicAction } from '../../redux/actions/topic.action';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import { response_status, response_status_codes } from '../../sub_modules/share/api_services/http_status';
import { Course } from '../../sub_modules/share/model/courses';
import Topic from '../../sub_modules/share/model/topic';
import { getBrowserSlug, getCategorySlug, getCoursePageSlug, getTopicPageSlug } from '../../utils/router';
import { apiGetCategoriesByParent, apiGetCategoryById, apiGetCategoryBySlug } from '../../utils/apis/categoryApi';
import { apiGetCourseById } from '../../utils/apis/courseApi';
import { apiGetTopicById } from '../../utils/apis/topicApi';
import { setCurrentCategoryAction } from '../../redux/actions/category.actions';

type SlugTypes = {
  slug: string;
  type: number;
  id: string;
  category?: _Category;
  childCategories?: _Category[];
  course?: Course;
  topic?: Topic;
}

const Slug = (props: SlugTypes) => {
  const { id, slug, type = PAGE_ERROR } = props;
  const mapTypePage = {
    [PAGE_CATEGORY_DETAIL]: <RootCategoryDetail category={props.category} childCategories={props.childCategories} />,
    [PAGE_COURSE_DETAIL]: <CourseDetail course={props.course} />,
    [PAGE_TOPIC_DETAIL]: <TopicDetail topic={props.topic} />,
    [PAGE_REPLY_COMMENT]: <ReplyComment category={props.category} childCategories={props.childCategories} />,
    [PAGE_NOT_FOUND]: <ErrorView message="Không tìm thấy trang" />,
    [PAGE_ERROR]: <ErrorView />
  }

  const breadcrumbItems = useMemo(() => {
    const items: { name: string; slug?: string; }[] = [];
    if (type === PAGE_CATEGORY_DETAIL) {
      const { category } = props;
      items.push({ name: category.name, slug: getCategorySlug({ category }) });
    } else if (type === PAGE_COURSE_DETAIL) {
      const { category, course } = props;
      items.push({ name: category.name, slug: getCategorySlug({ category }) });
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
    <Layout addMathJax={type === PAGE_TOPIC_DETAIL}>
      <MainHeader />
      {type !== PAGE_REPLY_COMMENT && <MainMenu />}
      {type !== PAGE_ERROR && type !== PAGE_ERROR && type !== PAGE_REPLY_COMMENT && <Breadcrumb items={breadcrumbItems} />}
      {mapTypePage[type ?? PAGE_ERROR]}
      {type !== PAGE_REPLY_COMMENT && <Footer />}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req }) => {
  const userInfo = await getUserFromToken(req);
  if (userInfo) store.dispatch(loginSuccessAction(userInfo));
  const slugs = query.slugs;
  try {
    if (slugs.length === 1) {
      const routePath = slugs[0];
      const items = routePath.split('-');
      const [id] = items.slice(-1);
      const type = Number(...items.slice(-2, -1));
      const slug = items.slice(0, -2).join('-');
      if (!id || !slug) return;

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
            id, type, slug, category, childCategories
          }
        }
      } else if (type === PAGE_REPLY_COMMENT) {
        return {
          props: { id, slug, type }
        }
      }
      return {
        props: { type: PAGE_NOT_FOUND }
      };
    } else {
      const [categorySlug, items] = slugs as string[];
      const [id] = items.split('-').slice(-1);
      const type = Number(...items.split('-').slice(-2, -1));
      const slug = items.split('-').slice(0, -2).join('-');
      const category = await apiGetCategoryBySlug(categorySlug);
      store.dispatch(setCurrentCategoryAction(category));
      if (!id || !slug) return {
        props: { type: PAGE_NOT_FOUND }
      }
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
          id, slug, type, category, course, topic
        }
      }
    }
  } catch (e) {
    console.log('Internal Server Error', e);
    return {
      props: { type: PAGE_ERROR }
    };
  }
});

export default Slug;
