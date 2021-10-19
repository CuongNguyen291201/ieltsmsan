import { Badge } from "antd";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CourseItem from '../../components/CourseItem';
import Layout from '../../components/Layout';
import SearchBox from "../../components/SearchBox";
import { AppState } from "../../redux/reducers";
import { wrapper } from "../../redux/store";
import { getUserFromToken } from "../../sub_modules/common/api/userApis";
import { loginSuccessAction } from "../../sub_modules/common/redux/actions/userActions";
import { removeCookie, TOKEN } from "../../sub_modules/common/utils/cookie";
import UserCourse from '../../sub_modules/share/model/userCourse';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSeo from '../../sub_modules/share/model/webSeo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { apiGetMyCourses } from "../../utils/apis/courseApi";
import { apiWebInfo } from '../../utils/apis/webInfoApi';
import { apiWebSocial } from '../../utils/apis/webSocial';
import { Grid } from '@material-ui/core';
import './style.scss';
const MyCoursePage = (props: { webInfo?: WebInfo, webSeo?: WebSeo, webSocial?: WebSocial }) => {
    const router = useRouter();
    const [userCourses, setUserCoures] = useState<UserCourse[]>([]);
    const currentUser = useSelector((state: AppState) => state.userReducer.currentUser);


    useEffect(() => {
        if (!!currentUser) {
            apiGetMyCourses(currentUser?._id)
                .then((userCourses) => {
                    setUserCoures(userCourses);
                })
        }
    }, [currentUser]);

    return (
        <Layout {...props}>
            <div className="my-course">
                <div className="wrapper-my-course">
                    <div className="container">
                        <div className="title-search">
                            <h2>Khoá học của tôi</h2>
                            <div>
                                <SearchBox />
                            </div>
                        </div>
                        <Grid container spacing={2} className="wrapper-item-my-course">
                            {userCourses.map((userCourse) => {
                                const e = userCourse.course
                                return (
                                    <Grid key={e._id} item xs={12} sm={6} md={3}>
                                        <Badge.Ribbon text="Quá hạn học" color="red" style={!userCourse.isExpired && { display: 'none' }}>
                                            <CourseItem course={e} ownCourse />
                                        </Badge.Ribbon>
                                    </Grid>
                                )
                            })}
                        </Grid>
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
    } else {
        removeCookie(TOKEN);
    }
    const { webInfo, webSeo } = await apiWebInfo();
    const webSocial = await apiWebSocial();

    return { props: { webInfo, webSeo, webSocial } }
})

export default MyCoursePage;
