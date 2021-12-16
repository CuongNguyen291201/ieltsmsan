import { PropsWithoutRef } from 'react'
import CourseDetail from '../../components/CourseDetail'
import Layout from '../../components/Layout'
import { setCurrentCourseAction } from '../../redux/actions/course.actions'
import { wrapper } from '../../redux/store'
import { getUserFromToken } from '../../sub_modules/common/api/userApis'
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions'
import { Course } from '../../sub_modules/share/model/courses'
import WebInfo from '../../sub_modules/share/model/webInfo'
import WebSocial from '../../sub_modules/share/model/webSocial'
import { apiGetCourseById } from '../../utils/apis/courseApi'
import { apiWebInfo } from '../../utils/apis/webInfoApi'
import { apiWebSocial } from '../../utils/apis/webSocial'
import { ROUTER_NOT_FOUND } from '../../utils/router'

type CoursePageProps = {
  course: Course;
  webInfo?: WebInfo;
  webSocial?: WebSocial;
}

const CoursePage = (props: PropsWithoutRef<CoursePageProps>) => {
  const { course, webInfo, webSocial } = props;

  return (
    <Layout
      hideMenu
      webInfo={webInfo}
      webSocial={webSocial}
    >
      <CourseDetail course={course} webInfo={webInfo} />
    </Layout>
  )
}


export const getServerSideProps = wrapper.getServerSideProps(async ({ query, req, res, store }) => {
  store.dispatch(setCurrentCourseAction(null, true));
  const [user, { webInfo }, webSocial] = await Promise.all([
    getUserFromToken(req),
    apiWebInfo({ serverSide: true }),
    apiWebSocial(true)
  ]);

  if (user) store.dispatch(loginSuccessAction(user));
  const courseSlugItems = (query.courseSlug as string).split('-');
  const courseSlug = courseSlugItems.slice(0, -1).join('-');
  const [courseId] = courseSlugItems.slice(-1);

  if (courseId && courseSlug) {
    const course = await apiGetCourseById({ courseId, serverSide: true });

    if (encodeURIComponent(course?.slug) === courseSlug) {
      store.dispatch(setCurrentCourseAction(course, false));
      return {
        props: {
          course,
          webInfo,
          webSocial
        }
      }
    }
  }
  res.writeHead(302, { Location: ROUTER_NOT_FOUND }).end();
  return;
});

export default CoursePage;