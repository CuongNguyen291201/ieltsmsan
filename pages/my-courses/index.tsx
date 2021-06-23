import { GetServerSideProps } from "next";
import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/reducers";
import { wrapper } from "../../redux/store";
import { getUserFromToken } from "../../sub_modules/common/api/userApis";
import { loginSuccessAction } from "../../sub_modules/common/redux/actions/userActions";
import { removeCookie, TOKEN } from "../../sub_modules/common/utils/cookie";
import { apiGetMyCourses } from "../../utils/apis/courseApi";
import myCourseReducer, { myCourseInitState } from './myCourseReducer';
import { loadMyCourseAction } from "./ActionMyCourse"
import itemAvatar from '../../public/default/item-avatar.png';
import Header from '../../components/MainHeader/index'
import Menu from '../../components/MainMenu/index'
import Breadcrumb from '../../components/Breadcrumb/index'
import { getBrowserSlug, numberFormat } from '../../utils';
import SearchBox from "../../components/SearchBox";
import Ratings from '../../components/Ratings/index';
import { COURSE_DETAIL_PAGE_TYPE } from '../../sub_modules/share/constraint';
import './style.scss';
import { useRouter } from "next/router";
import { OtsvCategory } from "../../custom-types";
import { Course } from "../../sub_modules/share/model/courses";
import { Tooltip } from "@material-ui/core";
import Footer from "../../components/Footer/index"
const MyCoursePage = (props: { category?: OtsvCategory; course: Course }) => {
    const { category, course } = props;
    const [{ courses }, dispatch] = useReducer(myCourseReducer, myCourseInitState);
    const router = useRouter();

    const onClickItem = useCallback((course: Course) => {
        const courseSlug = getBrowserSlug(course.slug, COURSE_DETAIL_PAGE_TYPE, course._id);
        router.push({ pathname: courseSlug });
    }, [courses]);

    const currentUser = useSelector((state: AppState) => state.userReducer.currentUser);
    useEffect(() => {
        if (!!currentUser) {
            apiGetMyCourses(currentUser?._id)
                .then((courses) => {
                    dispatch(loadMyCourseAction(courses));
                })
        }
    }, [currentUser]);


    return (
        <div className="my-course">
            <Header />
            <Menu />
            <div className="wrapper-my-course">
                <div className="container">
                    <div className="title-search">
                        <h2>Khoá học của tôi</h2>
                        <div>
                            <SearchBox />
                        </div>
                    </div>
                    <div className="wrapper-item-my-course">
                        {courses.map((e) => {
                            const nameCourse = e.name
                            const shortDesc = e.shortDesc
                            return (
                                <div onClick={() => onClickItem(e)} key={e._id} className="my-course-item">
                                    <div className="image-my-course">
                                        <img src={e.avatar || itemAvatar} alt={e.name} />
                                        <div className="hover-my-course">
                                            <div className="detail-my-course">Chi tiết khoá học </div>
                                        </div>
                                    </div>

                                    <div className="my-course-infor">
                                        {nameCourse.length > 40 ? <Tooltip title={nameCourse} placement="bottom">
                                            <div className="crs-title dot-1">{nameCourse} </div>
                                        </Tooltip> : <div className="crs-title dot-1">{nameCourse} </div>}
                                        <div>
                                            {shortDesc.length > 60 ? <Tooltip title={shortDesc} placement="bottom">
                                                <div className="crs-desc dot-2">{shortDesc} </div>
                                            </Tooltip> : <div className="crs-desc dot-2">{shortDesc} </div>}
                                        </div>
                                        <div className="crs-rating">
                                            <div className="crs-point">{String(4.6).replace('.', ',')}</div>
                                            <div className="vote-star">
                                                <Ratings point={4.6} />
                                            </div>
                                            <div className="crs-mem">({500})</div>
                                        </div>
                                        <div className="crs-price">
                                            <div className="crs-discount-price">{numberFormat.format(e.cost - e.discountPrice)} VNĐ</div>
                                            {e.discountPrice !== 0 && <div className="crs-origin-price">{numberFormat.format(e.cost)} VNĐ</div>}
                                        </div>
                                        <div className="btn-video">
                                            Video
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, req }) => {
    const userInfo = await getUserFromToken(req);
    if (userInfo) {
        store.dispatch(loginSuccessAction(userInfo));
    } else {
        removeCookie(TOKEN);
    }
})

export default MyCoursePage;
