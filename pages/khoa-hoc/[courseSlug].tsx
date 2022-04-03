import { PropsWithoutRef } from 'react'
import CourseDetail from '../../components/CourseDetail'
import Layout from '../../components/Layout'
import SeoProps from "../../custom-types/SeoProps"
import useAuth from "../../hooks/useAuth"
import { setCurrentCourseAction } from '../../redux/actions/course.actions'
import { getWebMenuAction } from "../../redux/actions/menu.action"
import { wrapper } from '../../redux/store'
import { getUserFromToken } from '../../sub_modules/common/api/userApis'
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions'
import CourseContent from "../../sub_modules/share/model/courseContent"
import { Course } from '../../sub_modules/share/model/courses'
import WebInfo from '../../sub_modules/share/model/webInfo'
import WebSocial from '../../sub_modules/share/model/webSocial'
import { apiGetCourseById } from '../../utils/apis/courseApi'
import { apiGetPageLayout } from "../../utils/apis/pageLayoutApi"
import { apiWebInfo } from '../../utils/apis/webInfoApi'
import { apiWebSocial } from '../../utils/apis/webSocial'
import { getCoursePageSlug, ROUTER_NOT_FOUND } from '../../utils/router'

type CoursePageProps = {
  webInfo?: WebInfo;
  webSocial?: WebSocial;
} & SeoProps;

const CoursePage = (props: PropsWithoutRef<CoursePageProps>) => {
  const { webInfo, webSocial, ...seo } = props;
  useAuth();

  return (
    <Layout
      webInfo={webInfo}
      webSocial={webSocial}
      {...seo}
    >
      <CourseDetail />
    </Layout>
  )
}


export const getServerSideProps = wrapper.getServerSideProps(async ({ query, req, res, store }) => {
  store.dispatch(setCurrentCourseAction(null, true));
  const { webInfo , webSocial, webMenuItems } = await apiGetPageLayout({ menu: true })
  store.dispatch(getWebMenuAction(webMenuItems));
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
  return {
    notFound: true
  }
});

export default CoursePage;