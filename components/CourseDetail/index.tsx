import { CircularProgress } from '@material-ui/core';
import { Button, Col, Rate, Row, Skeleton } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useMemo, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapUserCourseStatus } from '../../custom-types/MapContraint';
import { useScrollToTop } from '../../hooks/scrollToTop';
import bannerDefault from '../../public/default/banner-default.jpg';
import { createOneAction } from '../../redux/actions';
import { setActiveCourseModalVisibleAction, setCourseOrderAction, setUserCourseAction } from '../../redux/actions/course.actions';
import { AppState } from '../../redux/reducers';
import { Scopes } from '../../redux/types';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { getCookie, TOKEN } from '../../sub_modules/common/utils/cookie';
import { showToastifyWarning } from '../../sub_modules/common/utils/toastify';
import { USER_TYPE_HAS_ROLE } from '../../sub_modules/share/constraint';
import CourseContent from '../../sub_modules/share/model/courseContent';
import { Course } from '../../sub_modules/share/model/courses';
import { numberFormat } from '../../utils';
import { apiGetUserCourse, apiJoinCourse } from '../../utils/apis/courseApi';
import orderUtils from '../../utils/payment/orderUtils';
import { getPaymentPageSlug } from '../../utils/router';
import ActiveCourseModal from '../ActiveCourseModal';
import Breadcrumb from '../Breadcrumb';
import MainMenu from '../MainMenu';
import CourseContentView from './CourseContentView';
import {
  courseDetailInitState,
  courseDetailReducer,
  CourseTab, setActiveLoading, setActiveTab
} from './courseDetail.logic';
import CourseTopicTreeView from './CourseTopicTreeView';
import MemberListView from './MemberListView';
import iconCircle from '../../public/default/icon-circle.png';
import iconNewCourse from '../../public/default/new_.png';
import iconPrice from '../../public/default/icon-price_.png';
import iconTotalStudent from '../../public/default/total-student.png';
import iconNumberStudy from '../../public/default/icon-number-study.png';
import iconClock from '../../public/default/icon-clock_.png';
import './style.scss';

const CourseDetail = (props: { course: Course }) => {
  const { course } = props;
  const router = useRouter();
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { userCourse, userCourseLoading, isJoinedCourse, isVisibleActiveCourseModal, currentCourseLoading } = useSelector((state: AppState) => state.courseReducer);
  const [{
    activeTab,
    activeLoading
  }, uiLogic] = useReducer(courseDetailReducer, courseDetailInitState);
  const dispatch = useDispatch();
  const isCourseDiscount = useMemo(() => !!course.cost && !!course.discountPrice, [course]);

  useScrollToTop();

  useEffect(() => {
    // uiLogic(setActiveTab(!currentUser || (currentUser && router.query?.activeTab) ? CourseTab.COURSE_CONTENT : CourseTab.COURSE_TOPIC_TREE));
    if (!currentCourseLoading) {
      if (!!currentUser) {
        const token = getCookie(TOKEN);
        apiGetUserCourse({ token, courseId: course._id })
          .then((uc) => {
            dispatch(setUserCourseAction(uc));
            uiLogic(setActiveLoading(false));
          })
          .catch((e) => {
            showToastifyWarning('Có lỗi xảy ra!');
          });
      } else {
        dispatch(setUserCourseAction(null));
      }
    }
  }, [currentUser, currentCourseLoading]);

  const joinCourse = () => {
    if (!currentUser) {
      dispatch(showLoginModalAction(true));
      return;
    }
    const token = getCookie(TOKEN);
    if (!token || activeLoading || userCourseLoading) return;
    if (course.cost && (!userCourse || userCourse?.isExpired)) {
      dispatch(setActiveCourseModalVisibleAction(true));
    } else if (!course.cost && !userCourse) {
      uiLogic(setActiveLoading(true));
      apiJoinCourse({ token, courseId: course._id })
        .then((newUserCourse) => {
          dispatch(setUserCourseAction(newUserCourse))
          uiLogic(setActiveLoading(false));
        })
        .catch((e) => {
          showToastifyWarning('Có lỗi xảy ra!');
        });
    }
    return;
  }

  return (
    <>
      <div className="wraper-container">
        <div className="header-course">
          <MainMenu />
          <div className="background-header-course">
            <Breadcrumb items={[{ name: course.name }]} />
            <div className="container">
              <div className="title"><h1>{course.name}</h1></div>
              <div className="description">{course.shortDesc}</div>
              <div className="overview-item">
                <div className="item-main">
                  <span className="ratting">
                    <Rate className="rating-star" value={4.6} allowHalf disabled defaultValue={course.courseSystem?.vote ?? 4.6} />
                  </span>
                  <span className="total-user-rate">(38,820 ratings)<span>{course.courseSystem?.memberNum ?? 1000}k Students</span></span>
                </div>
              </div>
            </div>
            <div className="tag-course">
              Video
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: 'white' }}>
          <div className="container">
            <Row id="main-course-detail">
              <Col span={24} lg={16} className="course-detail">
                <Skeleton loading={userCourseLoading}>
                  <div className="course-content">
                    <h2>Nội dung khóa học</h2>
                    <div dangerouslySetInnerHTML={{
                      __html: (course.courseContent as CourseContent)?.desc
                    }}>
                    </div>
                  </div>
                  <div className="list-topic-tree-item">
                    <h2>Danh Sách Bài Học</h2>
                    <div className="course-topic-tree">
                      <CourseTopicTreeView course={course} />
                    </div>
                  </div>
                </Skeleton>
              </Col>
              <Col span={24} lg={8}>
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
                          <img src={iconPrice} alt="iconPrice" /> {isCourseDiscount && <div className={`origin-price${isCourseDiscount ? ' discount' : ''}`}>{numberFormat.format(course.cost)} VNĐ</div>}
                          <div className="price-real text">{course.cost ? `${numberFormat.format(course.cost - course.discountPrice)} VNĐ` : 'Miễn phí'}</div>
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
              </Col>
            </Row>
          </div>
        </div>
        <ActiveCourseModal
          courseId={course._id}
          isVisible={isVisibleActiveCourseModal}
          setVisible={() => {
            dispatch(setActiveCourseModalVisibleAction(false))
          }}
        />
      </div>
    </>
  )
}

export default CourseDetail;
