import { GetServerSideProps } from 'next';
import React from 'react';
import CourseDetail from '../../components/CourseDetail';
import Layout from '../../components/Layout';
import MainHeader from '../../components/MainHeader';
import MainMenu from '../../components/MainMenu';
import RootCategoryDetail from '../../components/RootCategoryDetail';
import TopicDetail from '../../components/TopicDetail';
import { OtsvCategory } from '../../custom-types';
import { setCurrentCourseAction } from '../../redux/actions/course.actions';
import { setCurrrentTopicAction } from '../../redux/actions/topic.action';
import { wrapper } from '../../redux/store';
import { getTopicByIdApi } from '../../sub_modules/common/api/topicApi';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import { response_status, response_status_codes } from '../../sub_modules/share/api_services/http_status';
import { CATEGORY_DETAIL_PAGE_TYPE, COURSE_DETAIL_PAGE_TYPE, TOPIC_DETAIL_PAGE_TYPE } from '../../sub_modules/share/constraint';
import { Course } from '../../sub_modules/share/model/courses_ts';
import { apiGetCategoriesByParent, apiGetCategoryById } from '../../utils/apis/categoryApi';
import { apiGetCourseById } from '../../utils/apis/courseApi';

type SlugTypes = {
  slug: string;
  type: number;
  id: string;
  category?: OtsvCategory;
  childCategories?: OtsvCategory[];
  course?: Course;
  topic?: any
}

const DEFAULT_PAGE_TYPE = -1;
const ERROR_PAGE = -2;

const Slug = (props: SlugTypes) => {
  const { id, slug, type = DEFAULT_PAGE_TYPE } = props;
  const mapTypePage = {
    [CATEGORY_DETAIL_PAGE_TYPE]: <RootCategoryDetail category={props.category} childCategories={props.childCategories} />,
    [COURSE_DETAIL_PAGE_TYPE]: <CourseDetail course={props.course} />,
    [TOPIC_DETAIL_PAGE_TYPE]: <TopicDetail topic={props.topic} />,
    [DEFAULT_PAGE_TYPE]: <div>404</div>,
    [ERROR_PAGE]: <div>500</div>
  }
  return (
    <Layout addMathJax={type === TOPIC_DETAIL_PAGE_TYPE}>
      <MainHeader />
      <MainMenu />
      {mapTypePage[type ?? DEFAULT_PAGE_TYPE]}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req }) => {
  const userInfo = await getUserFromToken(req);
  if (userInfo) store.dispatch(loginSuccessAction(userInfo));

  const items = (query.slug as string).split('-');
  const [id] = items.slice(-1);
  const type = Number(...items.slice(-2, -1));
  const slug = items.slice(0, -2).join('-');
  if (!id || !slug) return;
  try {
    if (type === CATEGORY_DETAIL_PAGE_TYPE) {
      let category: OtsvCategory = null;
      let childCategories: OtsvCategory[] = [];
      const [categoryRes, childCategoriesRes] = await Promise.all([apiGetCategoryById(id), apiGetCategoriesByParent(id)]);
      if (categoryRes.status === response_status.success && childCategoriesRes.status === response_status.success) {
        category = categoryRes.data;
        childCategories = childCategoriesRes.data;
      }
      return {
        props: {
          id, type, slug, category: categoryRes.data, childCategories: childCategoriesRes.data
        }
      }
    } else if (type === COURSE_DETAIL_PAGE_TYPE) {
      store.dispatch(setCurrentCourseAction(null, true));
      let course: Course = null;
      const { data, status } = await apiGetCourseById(id);
      if (status === response_status_codes.success) course = data;
      store.dispatch(setCurrentCourseAction(course));
      return {
        props: {
          id, type, slug, course
        }
      }
    } else if (type === TOPIC_DETAIL_PAGE_TYPE) {
      store.dispatch(setCurrrentTopicAction(null, true));
      const topic = await getTopicByIdApi(id);
      if (!topic) return { props: { type: ERROR_PAGE } };
      store.dispatch(setCurrrentTopicAction(topic));
      return {
        props: { id, slug, type, topic }
      }
    }
    return;
  } catch (_) {
    console.log('Internal Server Error');
    return {
      props: { type: ERROR_PAGE }
    };
  }
});

export default Slug;
