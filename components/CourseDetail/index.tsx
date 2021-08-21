import { useEffect, useMemo, useReducer, useState } from 'react';
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { useScrollToTop } from '../../hooks/scrollToTop';
import bannerDefault from '../../public/default/banner-default.jpg';
import { AppState } from '../../redux/reducers';
import { Course } from '../../sub_modules/share/model/courses';
import { numberFormat } from '../../utils';
import CourseContentView from './CourseContentView';
import CourseTopicTreeView from './CourseTopicTreeView';
import './style.scss';
import {
  courseDetailInitState,
  courseDetailReducer,
  CourseTab,
  setUserCourse,
  setActiveTab,
  setLoading
} from './courseDetail.logic';
import { getCookie, TOKEN } from '../../sub_modules/common/utils/cookie';
import { apiGetUserCourse, apiJoinCourse } from '../../utils/apis/courseApi';
import { Button, Col, Spin, Row, Rate } from 'antd';
import { CachedOutlined } from '@material-ui/icons'
import { STATUS_OPEN } from '../../sub_modules/share/constraint';
import { MapUserCourseStatus } from '../../custom-types/MapContraint';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { showToastifyWarning } from '../../sub_modules/common/utils/toastify';

const CourseDetail = (props: { course: Course }) => {
  const { course } = props;
  const router = useRouter();
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const [{
    activeTab,
    userCourse,
    activeLoading,
    userCourseLoading,
    isJoin
  }, uiLogic] = useReducer(courseDetailReducer, courseDetailInitState);
  const dispatch = useDispatch();
  const isCourseDiscount = useMemo(() => !!course.cost && !!course.discountPrice, [course]);

  useScrollToTop();

  useEffect(() => {
    uiLogic(setActiveTab(!currentUser || (currentUser && router.query?.activeTab) ? CourseTab.COURSE_CONTENT : CourseTab.COURSE_TOPIC_TREE));
    if (!!currentUser) {
      uiLogic(setLoading(true, 'userCourseLoading'));
      const token = getCookie(TOKEN);
      apiGetUserCourse({ token, courseId: course._id })
        .then((uc) => {
          uiLogic(setUserCourse(uc));
          uiLogic(setLoading(false, 'userCourseLoading'));
        })
    }
  }, [currentUser]);

  const joinCourse = () => {
    if (!currentUser) {
      dispatch(showLoginModalAction(true));
      return;
    }
    const token = getCookie(TOKEN);
    if (!token) return;
    if (course.cost && (!userCourse || userCourse?.isExpired)) {
      // Kich hoat khoa hoc
    } else if (!course.cost && !userCourse) {
      uiLogic(setLoading(true, 'activeLoading'));
      apiJoinCourse({ token, courseId: course._id })
        .then((newUserCourse) => {
          uiLogic(setUserCourse(newUserCourse));
          uiLogic(setLoading(false, 'activeLoading'));
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
            </div>
            {
              activeTab === CourseTab.COURSE_CONTENT ? <CourseContentView course={course} /> : <CourseTopicTreeView course={course} />
            }
          </Col>
          <Col span={24} lg={6} style={{ padding: "10px" }}>
            <div id="course-overview">
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

              <span className={`price${isCourseDiscount ? ' discount' : ''}`}>{course.cost ? `${numberFormat.format(course.cost - course.discountPrice)} VNĐ` : 'Miễn phí'}</span>
              {isCourseDiscount && <span className="origin-price">{numberFormat.format(course.cost)} VNĐ</span>}

              {course.status !== STATUS_OPEN
                && <div className="button-group">
                  <Button type="primary" size="large" className="btn bgr-root">Thêm vào <i className="fas fa-cart-plus" /></Button>
                  <Button type="primary" size="large" className="btn bgr-green">Mua ngay</Button>
                </div>}

              <div className="button-group">
                <Button type="primary" size="large" className="btn bgr-root" onClick={() => joinCourse()}>
                  {activeLoading || userCourseLoading
                    ? <Spin indicator={<CachedOutlined />} />
                    : course.cost
                      ? (!isJoin ? 'Kích hoạt khoá học' : 'Đã tham gia')
                      : (userCourse ? MapUserCourseStatus[userCourse.status] : 'Tham gia khoá học')
                  }
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default CourseDetail;
