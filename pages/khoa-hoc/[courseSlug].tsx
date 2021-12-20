import { PropsWithoutRef } from 'react'
import CourseDetail from '../../components/CourseDetail'
import Layout from '../../components/Layout'
import SeoProps from "../../custom-types/SeoProps"
import { setCurrentCourseAction } from '../../redux/actions/course.actions'
import { wrapper } from '../../redux/store'
import { getUserFromToken } from '../../sub_modules/common/api/userApis'
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions'
import CourseContent from "../../sub_modules/share/model/courseContent"
import { Course } from '../../sub_modules/share/model/courses'
import WebInfo from '../../sub_modules/share/model/webInfo'
import WebSocial from '../../sub_modules/share/model/webSocial'
import { apiGetCourseById } from '../../utils/apis/courseApi'
import { apiWebInfo } from '../../utils/apis/webInfoApi'
import { apiWebSocial } from '../../utils/apis/webSocial'
import { getCoursePageSlug, ROUTER_NOT_FOUND } from '../../utils/router'

type CoursePageProps = {
  course: Course;
  webInfo?: WebInfo;
  webSocial?: WebSocial;
} & SeoProps;

const CoursePage = (props: PropsWithoutRef<CoursePageProps>) => {
  const { course, webInfo, webSocial, ...seo } = props;

  return (
    <Layout
      hideMenu
      webInfo={webInfo}
      webSocial={webSocial}
      {...seo}
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
    const course: Course = await apiGetCourseById({ courseId, serverSide: true });

    if (encodeURIComponent(course?.slug) === courseSlug) {
      store.dispatch(setCurrentCourseAction(course, false));
      const courseContent: CourseContent = course?.courseContent;
      return {
        props: {
          course,
          webInfo,
          webSocial,
          title: courseContent?.titleSeo,
          description: courseContent?.descriptionSeo,
          robot: courseContent?.robotSeo,
          canonicalSlug: getCoursePageSlug({ course })
        }
      }
    }
  }
  res.writeHead(302, { Location: ROUTER_NOT_FOUND }).end();
  return;
});

export default CoursePage;