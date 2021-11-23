import { Button } from "@material-ui/core";
import { useRouter } from "next/router";
import { useMemo, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapUserCourseStatus } from '../../../custom-types/MapContraint';
import iconCircle from '../../../public/default/icon-circle.png';
import iconClock from '../../../public/default/icon-clock_.png';
import iconNumberStudy from '../../../public/default/icon-number-study.png';
import iconPrice from '../../../public/default/icon-price_.png';
import iconNewCourse from '../../../public/default/new_.png';
import iconTotalStudent from '../../../public/default/total-student.png';
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
    const [{
        activeLoading,
        showCourseMembers
    }, uiLogic] = useReducer(infoCourseReducer, infoCourseInitState);

    const isTeacher = useMemo(() => userCourse?.isTeacher, [userCourse]);

    const joinCourse = () => {
        if (!currentUser) {
            dispatch(showLoginModalAction(true));
            return;
        }
        if (activeLoading || userCourseLoading) return;
        if (course.cost && (!userCourse || userCourse?.isExpired) && currentUser !== USER_TYPE_HAS_ROLE) {
            dispatch(setActiveCourseModalVisibleAction(true));
        } else if (!course.cost && !userCourse) {
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

    // const renderCourseMembersModal = () => (
    //     <Modal
    //         visible={showCourseMembers}
    //         footer={null}
    //         onCancel={() => {
    //             uiLogic(setShowCourseMembers(false));
    //         }}
    //         centered
    //         width="100%"
    //         title="Danh sách học viên"
    //         bodyStyle={{ maxHeight: "80vh" }}
    //     >
    //         <MemberListView course={course} />
    //     </Modal>
    // )
    const goToListMember = () =>{
        if (isTeacher) {
            router.push(getCourseMembersPageSlug({course}))
        }
    }
    return (
        <div id="course-overview">
            {/* {renderCourseMembersModal()} */}
            <SkeletonContainer loading={currentCourseLoading} noTransform>
                <div className="information-course">
                    <div>
                        {/* {(course?.courseContent as CourseContent)?.videoIntro} */}
                        <img src={course?.avatar || "https://storage.googleapis.com/ielts-fighters.appspot.com/elearning-react/2021/10/30/54040744ielts_writing_image"} alt="course-info" width="100%" height="200px" />
                        {/* <iframe width="100%" height="200px" src="https://www.youtube.com/embed/Vo7N4uSaJV8?list=RDVo7N4uSaJV8" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe> */}
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
                            <span className="icon"><img src={iconTotalStudent} /></span> <div className="text" onClick={goToListMember}>Tổng học viên</div> <span className="number__">9999</span>
                        </div>
                        <div className="number-study item__">
                            <span className="icon"><img src={iconNumberStudy} alt="iconNumberStudy" /></span> <div className="text">Số bài học</div> <span className="number__">123</span>
                        </div>
                        <div className="time-study item__">
                            <span className="icon"><img src={iconClock} alt="iconClock" /></span> <div className="text">Thời gian học</div><span className="number__">{course.courseContent?.timeStudy ? `${course.courseContent?.timeStudy} ngày` : 'Không giới hạn'}</span>
                        </div>
                    </div>
                </div>
                {(!isJoinedCourse || userCourse?.isExpired)
                    && !!course.cost
                    ? <div className="button-group">
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
                    </div>
                    :
                    <>{userCourse?.status !== USER_COURSE_APPROVE && <div className="button-group">
                        <div>
                            <Button variant="outlined" size="large" className="btn btn-root" onClick={() => {
                                joinCourse()
                            }}>
                                {userCourse ? MapUserCourseStatus[userCourse.status] : 'Tham gia khoá học'}
                            </Button>
                        </div>
                    </div>}
                    </>
                }

                {/* <div className="button-group">
                      <Button style={{ width: "100%" }} type="primary" size="large" className="btn bgr-root" onClick={() => joinCourse()}>
                        {activeLoading || userCourseLoading
                          ? <CircularProgress style={{ color: "white" }} size={25} />
                          : course.cost
                            ? (!isJoinedCourse ? 'Kích hoạt khoá học' : 'Đã tham gia')
                            : (userCourse ? MapUserCourseStatus[userCourse.status] : 'Tham gia khoá học')
                        }
                      </Button>
                    </div> */}
            </SkeletonContainer>
        </div>
    )
}