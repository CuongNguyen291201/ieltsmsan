import { Badge as MuiBadge, Grid } from "@mui/material";
import { withStyles } from "@mui/styles";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Breadcrumb from "../../components/Breadcrumb";
import CourseItem from '../../components/CourseItem';
import Layout from '../../components/Layout';
import SearchBox from "../../components/SearchBox";
import { getWebMenuAction } from "../../redux/actions/menu.action";
import { AppState } from "../../redux/reducers";
import { wrapper } from "../../redux/store";
import { getUserFromToken } from "../../sub_modules/common/api/userApis";
import { loginSuccessAction } from "../../sub_modules/common/redux/actions/userActions";
import UserCourse from '../../sub_modules/share/model/userCourse';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { apiGetMyCourses } from "../../utils/apis/courseApi";
import { apiGetPageLayout } from "../../utils/apis/pageLayoutApi";
import { ROUTER_MY_COURSES } from "../../utils/router";
import coursesOpen from "../../public/images/icons/course-open.svg";
import myCourses from "../../public/images/icons/my-courses.svg";
import './style.scss';
const MyCoursePage = (props: { webInfo?: WebInfo, webSocial?: WebSocial }) => {
    const router = useRouter();
    const [userCourses, setUserCoures] = useState<UserCourse[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const currentUser = useSelector((state: AppState) => state.userReducer.currentUser);


    useEffect(() => {
        if (!!currentUser) {
            apiGetMyCourses(currentUser?._id)
                .then(({ userCourses, coursesOpen }) => {
                    setUserCoures(userCourses);
                    setCourses(coursesOpen)
                })
        }
    }, [currentUser]);

    const Badge = withStyles((_) => ({
        root: {
            width: "100%"
        },
        badge: {
            right: "40px",
            top: "10px",
            borderRadius: 0
        }
    }))(MuiBadge);

    return (
        <Layout {...props} title="Khoá học của tôi" useDefaultBackground>
            <div className="my-course">
                <div className="wrapper-my-course">
                    <div className="container">
                        <Breadcrumb items={[{ name: "Khoá học của tôi", slug: ROUTER_MY_COURSES }]} />
                        <div className="title-search">
                            <h2>Khoá học của tôi</h2>
                            <div>
                                <SearchBox />
                            </div>
                        </div>
                        <div>
                            <h3><img src={coursesOpen} /> Khóa học miễn phí</h3>
                            <Grid container spacing={2} className="wrapper-item-my-course">
                                {courses.map((course) => {
                                    return (
                                        <Grid key={course._id} item xs={12} sm={6} md={3}>
                                            <CourseItem course={course} ownCourse />
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </div>
                        <div style={{ paddingTop: "50px" }}>
                            <h3><img src={myCourses} /> Khóa Học Đã Mua</h3>
                            <Grid container spacing={2} className="wrapper-item-my-course">
                                {userCourses.map((userCourse) => {
                                    const e = userCourse.course
                                    return (
                                        <Grid key={e._id} item xs={12} sm={6} md={3}>
                                            <Badge badgeContent="Quá hạn học" invisible={!!userCourse.isExpired} color="error">
                                                <CourseItem course={e} ownCourse />
                                            </Badge>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, req }) => {
    const userInfo = await getUserFromToken(req);
    if (userInfo) {
        store.dispatch(loginSuccessAction(userInfo));
    }
    const { webInfo, webSocial, webMenuItems } = await apiGetPageLayout({ menu: true });
    store.dispatch(getWebMenuAction(webMenuItems));
    return { props: { webInfo, webSocial } }
})

export default MyCoursePage;
