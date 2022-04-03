import CircularProgress from '@mui/material/CircularProgress';
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { PropsWithoutRef, useEffect, useState } from "react";
import { InfoCourse } from "../../components/InfoCourse";
import Layout from '../../components/Layout';
import useAuth from "../../hooks/useAuth";
import { setCurrentCourseAction } from "../../redux/actions/course.actions";
import { getWebMenuAction } from "../../redux/actions/menu.action";
import { wrapper } from "../../redux/store";
import { Course } from "../../sub_modules/share/model/courses";
import WebInfo from "../../sub_modules/share/model/webInfo";
import WebSocial from "../../sub_modules/share/model/webSocial";
import { apiGetCourseById, apiGetUserCourse } from "../../utils/apis/courseApi";
import { apiGetPageLayout } from "../../utils/apis/pageLayoutApi";
import { getCoursePageSlug } from "../../utils/router";

const MemberListView = dynamic(() => import("../../components/CourseDetail/MemberListView"));

type CourseMembersPageProps = {
  course: Course;
  webInfo?: WebInfo;
  webSocial?: WebSocial;
}

const CourseMembersPage = (props: PropsWithoutRef<CourseMembersPageProps>) => {
  const { course, webInfo, webSocial } = props;
  const router = useRouter();
  const [isReady, setReady] = useState(false);
  useAuth();

  useEffect(() => {
    apiGetUserCourse({ courseId: course._id })
      .then((userCourse) => {
        if (!userCourse?.isTeacher) {
          router.replace(getCoursePageSlug({ course }));
          return;
        }
        setReady(true);
      })
      .catch((e) => {
        console.error(e);
      })
  }, []);

  return (
    <Layout
      hideMenu
      webInfo={webInfo}
      webSocial={webSocial}
    >
      <InfoCourse course={course} />
      {isReady ? <MemberListView course={course} /> : <div style={{ textAlign: 'center' }}><CircularProgress /></div>}
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store, req, res, query }) => {
  store.dispatch(setCurrentCourseAction(null, true));
  const { webInfo, webSocial, webMenuItems } = await apiGetPageLayout({ menu: true })
  store.dispatch(getWebMenuAction(webMenuItems));
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
          webSocial,
        }
      }
    }
  }
  return {
    notFound: true
  }
})

export default CourseMembersPage;
