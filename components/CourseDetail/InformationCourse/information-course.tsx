import { Button, Skeleton } from "antd";
import { Course } from "../../../sub_modules/share/model/courses";
import iconCircle from '../../../public/default/icon-circle.png';
import iconNewCourse from '../../../public/default/new_.png';
import iconPrice from '../../../public/default/icon-price_.png';
import iconTotalStudent from '../../../public/default/total-student.png';
import iconNumberStudy from '../../../public/default/icon-number-study.png';
import iconClock from '../../../public/default/icon-clock_.png';
import bgPostion from '../../public/default/positionBg.png';
import { useMemo } from "react";
import { numberFormat } from '../../../utils';
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/reducers";
import orderUtils from '../../../utils/payment/orderUtils';
import { useRouter } from "next/router";
import { getPaymentPageSlug } from '../../../utils/router';
import { createOneAction } from '../../../redux/actions';
import { Scopes } from '../../../redux/types';
import './style.scss'
export const InformationCourse = (props: { course: Course }) => {
    const { course } = props
    const router = useRouter();
    const dispatch = useDispatch();
    const { userCourse, userCourseLoading, isJoinedCourse, isVisibleActiveCourseModal, currentCourseLoading } = useSelector((state: AppState) => state.courseReducer);
    const isCourseDiscount = useMemo(() => !!course.cost && !!course.discountPrice, [course]);

    return (
        <div id="course-overview">
            <Skeleton loading={userCourseLoading}>
                <div className="information-course">
                    <div>
                        <iframe width="100%" height="200px" src="https://www.youtube.com/embed/Vo7N4uSaJV8?list=RDVo7N4uSaJV8" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
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
                            <img src={iconPrice} alt="iconPrice" />  <div className="price-real text">{course.cost ? `${numberFormat.format(course.cost - course.discountPrice)} VNĐ` : 'Miễn phí'}</div>
                            {isCourseDiscount && <div className={`origin-price${isCourseDiscount ? ' discount' : ''}`}>{numberFormat.format(course.cost)} VNĐ</div>}
                        </div>
                        <div className="total-student item__">
                            <img src={iconTotalStudent} /> <div className="text">Tổng học viên</div> <span className="number__">9999</span>
                        </div>
                        <div className="number-study item__">
                            <img src={iconNumberStudy} alt="iconNumberStudy" /> <div className="text">Số bài học</div> <span className="number__">123</span>
                        </div>
                        <div className="time-study item__">
                            <img src={iconClock} alt="iconClock" /><div className="text">Thời gian học</div><span className="number__">{course.courseContent?.timeStudy ? `${course.courseContent?.timeStudy} ngày` : 'Không giới hạn'}</span>
                        </div>
                    </div>
                </div>
                {!!course.cost && (!isJoinedCourse || userCourse.isExpired)
                    && <div className="button-group">
                        <div>
                            <Button type="primary" size="large" className="btn bgr-green" onClick={() => {
                                orderUtils.setReturnUrl(router.asPath);
                                router.push(getPaymentPageSlug(course._id));
                            }}>Mua ngay</Button>
                        </div>
                        <div>
                            <Button type="primary" size="large" className="btn bgr-root" onClick={() => {
                                orderUtils.addCourseToCart(course._id, () => {
                                    dispatch(createOneAction(Scopes.CART, course._id));
                                })
                            }}>Thêm vào giỏ</Button>
                        </div>

                    </div>}

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
            </Skeleton>
        </div>
    )
}