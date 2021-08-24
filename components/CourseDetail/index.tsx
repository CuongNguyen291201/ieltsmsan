import { CircularProgress } from '@material-ui/core';
import { Button, Col, Rate, Row, Skeleton } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useReducer } from 'react';
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
import { STATUS_OPEN } from '../../sub_modules/share/constraint';
import { Course } from '../../sub_modules/share/model/courses';
import { numberFormat } from '../../utils';
import { apiGetUserCourse, apiJoinCourse } from '../../utils/apis/courseApi';
import orderUtils from '../../utils/payment/orderUtils';
import { getPaymentPageSlug } from '../../utils/router';
import ActiveCourseModal from '../ActiveCourseModal';
import CourseContentView from './CourseContentView';
import {
  courseDetailInitState,
  courseDetailReducer,
  CourseTab, setActiveLoading, setActiveTab
} from './courseDetail.logic';
import CourseTopicTreeView from './CourseTopicTreeView';
import MemberListView from './MemberListView';
import './style.scss';

const CourseDetail = (props: { course: Course }) => {
  const { course } = props;
  const router = useRouter();
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { userCourse, userCourseLoading, isJoinedCourse, isVisibleActiveCourseModal } = useSelector((state: AppState) => state.courseReducer);
  const [{
    activeTab,
    activeLoading
  }, uiLogic] = useReducer(courseDetailReducer, courseDetailInitState);
  const dispatch = useDispatch();
  const isCourseDiscount = useMemo(() => !!course.cost && !!course.discountPrice, [course]);

  useScrollToTop();

  useEffect(() => {
    uiLogic(setActiveTab(!currentUser || (currentUser && router.query?.activeTab) ? CourseTab.COURSE_CONTENT : CourseTab.COURSE_TOPIC_TREE));
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
  }, [currentUser]);

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
      <div className="course-info" style={{
        background: `linear-gradient(90deg, #f9f9f9 40%, rgba(255, 255, 255, 0) 60%), url(${course.avatar || bannerDefault})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}>
        <div className="container">
          <div className="title"><h1>{course.name}</h1></div>
        </div>
      </div>
      <div className="container">
        <Row id="main-course-detail">
          <Col span={24} lg={18} className="course-detail">
            <Skeleton loading={userCourseLoading}>
              <div className="tab-header">
                <div
                  className={`tab-title${activeTab === CourseTab.COURSE_CONTENT ? ' active' : ''}`}
                  onClick={() => uiLogic(setActiveTab(CourseTab.COURSE_CONTENT))}
                >
                  MÔ TẢ KHOÁ HỌC
                </div>
                <div
                  className={`tab-title${activeTab === CourseTab.COURSE_TOPIC_TREE ? ' active' : ''}`}
                  onClick={() => uiLogic(setActiveTab(CourseTab.COURSE_TOPIC_TREE))}
                >
                  DANH SÁCH BÀI HỌC
                </div>
                {userCourse?.isTeacher && <div
                  className={`tab-title${activeTab === CourseTab.COURSE_MEMBER ? ' active' : ''}`}
                  onClick={() => uiLogic(setActiveTab(CourseTab.COURSE_MEMBER))}
                >
                  DANH SÁCH HỌC VIÊN
                </div>}
              </div>
              {
                activeTab !== CourseTab.COURSE_TAB_NONE
                  ? (activeTab === CourseTab.COURSE_CONTENT
                    ? <CourseContentView course={course} />
                    : (activeTab === CourseTab.COURSE_TOPIC_TREE
                      ? <CourseTopicTreeView course={course} />
                      : <MemberListView course={course} />
                    ))
                  : <div style={{ textAlign: "center" }}><CircularProgress /></div>
              }
            </Skeleton>
          </Col>
          <Col span={24} lg={6}>
            <div id="course-overview">
              <Skeleton loading={userCourseLoading}>
                <div className="title-block"><h2>Thông tin khoá học</h2></div>
                <div className="short-desc">
                  {course.shortDesc}
                </div>
                <div className="overview-item">
                  <div className="item-main">
                    <span>
                      <Rate className="rating-star" allowHalf disabled defaultValue={course.courseSystem?.vote ?? 4.6} />
                    </span>
                    <span>({course.courseSystem?.memberNum ?? 500})</span>
                  </div>
                </div>

                <div className="overview-item">
                  <i className="far fa-clock" />
                  <div className="item-main">
                    <span role="label">Thời gian học:</span>
                    <span>{course.courseContent?.timeStudy ? `${course.courseContent?.timeStudy} ngày` : 'Không giới hạn'}</span>
                  </div>
                </div>

                {isCourseDiscount && <div className={`origin-price${isCourseDiscount ? ' discount' : ''}`}>{numberFormat.format(course.cost)} VNĐ</div>}
                <div className="price">{course.cost ? `${numberFormat.format(course.cost - course.discountPrice)} VNĐ` : 'Miễn phí'}</div>

                {!!course.cost
                  && <div className="button-group">
                    <Button type="primary" size="large" className="btn bgr-root" onClick={() => {
                      orderUtils.addCourseToCart(course._id, () => {
                        dispatch(createOneAction(Scopes.CART, course._id));
                      })
                    }}>Thêm vào <i className="fas fa-cart-plus" /></Button>
                    <Button type="primary" size="large" className="btn bgr-green" onClick={() => {
                      orderUtils.setReturnUrl(router.asPath);
                      router.push(getPaymentPageSlug(course._id));
                    }}>Mua ngay</Button>
                  </div>}

                <div className="button-group">
                  <Button style={{ width: "100%" }} type="primary" size="large" className="btn bgr-root" onClick={() => joinCourse()}>
                    {activeLoading || userCourseLoading
                      ? <CircularProgress style={{ color: "white" }} size={25} />
                      : course.cost
                        ? (!isJoinedCourse ? 'Kích hoạt khoá học' : 'Đã tham gia')
                        : (userCourse ? MapUserCourseStatus[userCourse.status] : 'Tham gia khoá học')
                    }
                  </Button>
                </div>
              </Skeleton>
            </div>
          </Col>
        </Row>
      </div>
      <ActiveCourseModal
        courseId={course._id}
        isVisible={isVisibleActiveCourseModal}
        setVisible={() => {
          dispatch(setActiveCourseModalVisibleAction(false))
        }}
      />
    </>
  )
}

export default CourseDetail;
