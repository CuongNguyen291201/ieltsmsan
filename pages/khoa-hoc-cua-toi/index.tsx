import { Tooltip } from "@material-ui/core";
import { Badge, Rate } from "antd";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
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
const MyCoursePage = () => {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const currentUser = useSelector((state: AppState) => state.userReducer.currentUser);


    useEffect(() => {
        if (!!currentUser) {
            apiGetMyCourses(currentUser?._id)
                .then((courses) => {
                    setCourses(courses);
                })
        }
    }, [currentUser]);

    const onClickItem = useCallback((course: Course) => {
        const courseSlug = getBrowserSlug(course.slug, PAGE_COURSE_DETAIL, course._id);
        router.push({ pathname: courseSlug });
    }, [courses]);

    return (
        <Layout>
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
                            {courses.map((e) => {
                                e = e.course
                                const nameCourse = e.name
                                const shortDesc = e.shortDesc
                                return (
                                    <Badge.Ribbon text="Quá hạn học" color="red" style={!e.isExpire && { display: 'none' }}>
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
                                                {/* <div className="crs-rating">
                                            <div className="crs-point">{String(4.6).replace('.', ',')}</div>
                                            <div className="vote-star">
                                                <Rate style={{ fontSize: '15px', color: '#ec1f24' }} disabled allowHalf defaultValue={4.5} />
                                            </div>
                                            <div className="crs-mem">({500})</div>
                                        </div> */}
                                                <div className="crs-rating">
                                                    <div className="crs-point">{String(4.6).replace('.', ',')}</div>
                                                    <div className="vote-star">
                                                        <Rate style={{ fontSize: '15px', color: '#ec1f24' }} disabled allowHalf defaultValue={4.5} />
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
                                    </Badge.Ribbon>
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
})

export default MyCoursePage;
