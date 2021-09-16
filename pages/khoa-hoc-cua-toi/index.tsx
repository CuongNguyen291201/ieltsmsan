import { Tooltip } from "@material-ui/core";
import { Badge, Rate } from "antd";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Footer from "../../components/Footer/index";
import Header from '../../components/MainHeader/index';
import Menu from '../../components/MainMenu/index';
import Layout from '../../components/Layout';
import SearchBox from "../../components/SearchBox";
import itemAvatar from '../../public/default/item-avatar.png';
import { AppState } from "../../redux/reducers";
import { wrapper } from "../../redux/store";
import { getUserFromToken } from "../../sub_modules/common/api/userApis";
import { loginSuccessAction } from "../../sub_modules/common/redux/actions/userActions";
import { removeCookie, TOKEN } from "../../sub_modules/common/utils/cookie";
import { PAGE_COURSE_DETAIL } from '../../custom-types/PageType';
import { Course } from "../../sub_modules/share/model/courses";
import { numberFormat } from '../../utils';
import { getBrowserSlug } from '../../utils/router';
import { apiGetMyCourses } from "../../utils/apis/courseApi";
import './style.scss';
import { apiWebInfo } from '../../utils/apis/webInfoApi';
import { apiWebSocial } from '../../utils/apis/webSocial';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSeo from '../../sub_modules/share/model/webSeo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import CourseItem from '../../components/CourseItem';
import UserCourse from '../../sub_modules/share/model/userCourse';
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

    const onClickItem = useCallback((course: Course) => {
        const courseSlug = getBrowserSlug(course.slug, PAGE_COURSE_DETAIL, course._id);
        router.push({ pathname: courseSlug });
    }, [userCourses]);

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
                        <div className="wrapper-item-my-course">
                            {userCourses.map((userCourse) => {
                                const e = userCourse.course
                                return (
                                    <Fragment key={e._id}>
                                        <Badge.Ribbon text="Quá hạn học" color="red" style={!userCourse.isExpired && { display: 'none' }}>
                                            <CourseItem course={e} ownCourse />
                                        </Badge.Ribbon>
                                    </Fragment>
                                )
                            })}
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
    } else {
        removeCookie(TOKEN);
    }
    const { webInfo, webSeo } = await apiWebInfo();
    const webSocial = await apiWebSocial();

    return { props: { webInfo, webSeo, webSocial } }
})

export default MyCoursePage;
