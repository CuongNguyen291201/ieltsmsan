import { useRouter } from "next/router";
import { PropsWithoutRef, useEffect, useState } from "react";
import { InfoCourse } from "../../components/CourseDetail/InfoCourse";
import Layout from '../../components/Layout';
import { setCurrentCourseAction } from "../../redux/actions/course.actions";
import { wrapper } from "../../redux/store";
import { getUserFromToken } from "../../sub_modules/common/api/userApis";
import { loginSuccessAction } from "../../sub_modules/common/redux/actions/userActions";
import { Course } from "../../sub_modules/share/model/courses";
import WebInfo from "../../sub_modules/share/model/webInfo";
import WebSocial from "../../sub_modules/share/model/webSocial";
import { apiGetCourseById, apiGetUserCourse } from "../../utils/apis/courseApi";
import { apiWebInfo } from "../../utils/apis/webInfoApi";
import { apiWebSocial } from "../../utils/apis/webSocial";
import { getCoursePageSlug, ROUTER_NOT_FOUND } from "../../utils/router";
import CircularProgress from '@mui/material/CircularProgress';
import dynamic from "next/dynamic";

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
           <InfoCourse course={course} webInfo={webInfo} />
            {isReady ? <MemberListView course={course} /> : <div style={{textAlign:'center'}}><CircularProgress/></div>}
        </Layout>
    )
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store, req, res, query }) => {
  store.dispatch(setCurrentCourseAction(null, true));
  const [user, { webInfo }, webSocial] = await Promise.all([
    getUserFromToken(req),
    apiWebInfo(),
    apiWebSocial()
  ]);

  if (user) store.dispatch(loginSuccessAction(user));
  const courseSlugItems = (query.courseSlug as string).split('-');
  const courseSlug = courseSlugItems.slice(0, -1).join('-');
  const [courseId] = courseSlugItems.slice(-1);
  if (courseId && courseSlug) {
    const course = await apiGetCourseById(courseId);

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
  res.writeHead(302, { Location: ROUTER_NOT_FOUND }).end();
  return;
})

export default CourseMembersPage;
