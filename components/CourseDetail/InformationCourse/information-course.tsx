import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useMemo, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapUserCourseStatus } from '../../../custom-types/MapContraint';
import iconCircle from '../../../public/images/icons/icon-circle.png';
import iconClock from '../../../public/images/icons/icon-clock_.png';
import iconNumberStudy from '../../../public/images/icons/icon-number-study.png';
import iconPrice from '../../../public/images/icons/icon-price_.png';
import iconNewCourse from '../../../public/images/icons/new_.png';
import iconTotalStudent from '../../../public/images/icons/total-student.png';
import { createOneAction } from '../../../redux/actions';
import { setActiveCourseModalVisibleAction, setUserCourseAction } from '../../../redux/actions/course.actions';
import { AppState } from "../../../redux/reducers";
import { Scopes } from '../../../redux/types';
import { showLoginModalAction } from '../../../sub_modules/common/redux/actions/userActions';
import { showToastifyWarning } from '../../../sub_modules/common/utils/toastify';
import { USER_COURSE_APPROVE, USER_TYPE_HAS_ROLE } from '../../../sub_modules/share/constraint';
import { Course } from "../../../sub_modules/share/model/courses";
import { numberFormat } from '../../../utils';
import { apiJoinCourse } from '../../../utils/apis/courseApi';
import orderUtils from '../../../utils/payment/orderUtils';
import { getCourseMembersPageSlug, getPaymentPageSlug } from '../../../utils/router';
import SkeletonContainer from "../../SkeletonContainer";
import {
    infoCourseInitState, infoCourseReducer,
    setActiveLoading
} from './infomationCourse.reducer';
import './style.scss';

export const InformationCourse = (props: { course: Course }) => {
    const { course } = props
    const router = useRouter();
    const dispatch = useDispatch();
    const { userCourse, userCourseLoading, isJoinedCourse, isVisibleActiveCourseModal, currentCourseLoading } = useSelector((state: AppState) => state.courseReducer);
    const { currentUser } = useSelector((state: AppState) => state.userReducer);
    const isCourseDiscount = useMemo(() => !!course.cost && !!course.discountPrice, [course]);
    const [{ activeLoading }, uiLogic] = useReducer(infoCourseReducer, infoCourseInitState);

    const isTeacher = useMemo(() => userCourse?.isTeacher, [userCourse]);

    const joinCourse = () => {
        if (!currentUser) {
            dispatch(showLoginModalAction(true));
            return;
        }
        if (activeLoading || userCourseLoading) return;
        if (!userCourse) {
            uiLogic(setActiveLoading(true));
            apiJoinCourse({ courseId: course._id })
                .then((uc) => {
                    dispatch(setUserCourseAction(uc));
                    uiLogic(setActiveLoading(false));
                })
                .catch((e) => {
                    showToastifyWarning("Có lỗi xảy ra!");
                })
        }
        return;
    }

    const goToListMember = () => {
        if (isTeacher) {
            router.push(getCourseMembersPageSlug({ course }))
        }
    }

    const renderCourseButtons = useCallback(() => {
        if (!isJoinedCourse || userCourse?.isExpired) {
            if (course.cost > 0) {
                return (<div className="button-group">
                    <div>
                        <Button variant="contained" size="large" className="btn bgr-green" onClick={() => {
                            orderUtils.setReturnUrl(router.asPath);
                            router.push(getPaymentPageSlug(course._id));
                        }}>Mua ngay</Button>
                    </div>
                    <div>
                        <Button variant="contained" size="large" className="btn bgr-root" onClick={() => {
                            orderUtils.addCourseToCart(course._id, () => {
                                dispatch(createOneAction(Scopes.CART, course._id));
                            })
                        }}>Thêm vào giỏ</Button>
                    </div>
                </div>)
            } else if (userCourse?.status !== USER_COURSE_APPROVE) {
                return (<div className="button-group">
                    <div>
                        <Button variant="outlined" size="large" className="btn bgr-root" onClick={() => {
                            joinCourse()
                        }}>
                            {userCourse ? MapUserCourseStatus[userCourse.status] : 'Tham gia khoá học'}
                        </Button>
                    </div>
                </div>)
            }
            return <></>
        }
        return <></>
    }, [isJoinedCourse, userCourse, course.cost])

    return (
        <div id="course-overview">
            <SkeletonContainer loading={currentCourseLoading} noTransform>
                <div className="information-course">
                    <div>
                        {/* {(course?.courseContent as CourseContent)?.videoIntro} */}
                        <img src={course?.avatar || "https://storage.googleapis.com/ielts-fighters.appspot.com/elearning-react/2021/10/30/54040744ielts_writing_image"} alt="course-info" width="100%" height="200px" />
                    </div>
                    <div className="discount-price">
                        GIẢM GIÁ <b>40%</b>
                    </div>
                    <div className="time-end-price">
                        <img style={{ marginRight: '20px' }} src={iconCircle} alt="iconCircle" />  Còn 10h ở mức giá này
                        <img className="_iconNew" src={iconNewCourse} alt="iconNewCourse" />
                    </div>
                    <div className="inf-course_">
                        <div className="price-and-discount-price item__">
                            <span className="icon"><img src={iconPrice} alt="iconPrice" /></span>  <div className="price-real text">{course.cost ? `${numberFormat.format(course.cost - course.discountPrice)} VNĐ` : 'Miễn phí'}</div>
                            {isCourseDiscount && <div className={`origin-price${isCourseDiscount ? ' discount' : ''}`}>{numberFormat.format(course.cost)} VNĐ</div>}
                        </div>
                        <div className={`total-student item__${isTeacher ? ' teacher' : ''}`}>
                            <span className="icon"><img src={iconTotalStudent} /></span> <div className="text" onClick={goToListMember}>Tổng học viên</div> <span className="number__">Đang cập nhật</span>
                        </div>
                        <div className="number-study item__">
                            <span className="icon"><img src={iconNumberStudy} alt="iconNumberStudy" /></span> <div className="text">Số bài học</div> <span className="number__">Đang cập nhật</span>
                        </div>
                        <div className="time-study item__">
                            <span className="icon"><img src={iconClock} alt="iconClock" /></span> <div className="text">Thời gian học</div><span className="number__">{course.courseContent?.timeStudy ? `${course.courseContent?.timeStudy} ngày` : 'Không giới hạn'}</span>
                        </div>
                    </div>
                </div>
                {renderCourseButtons()}
            </SkeletonContainer>
        </div>
    )
}