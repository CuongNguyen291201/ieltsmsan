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
import bgPostion from '../../public/default/positionBg.png';
import './style.scss';
import { ContentCourse } from './content-course';
import { InformationCourse } from './InformationCourse/information-course';
import WebInfo from '../../sub_modules/share/model/webInfo';
import { InfoCourse } from './InfoCourse';

const CourseDetail = (props: { course: Course, webInfo?: WebInfo }) => {
  const { course, webInfo } = props;
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
        // const token = getCookie(TOKEN);
        apiGetUserCourse({ courseId: course._id })
          .then((uc) => {
            dispatch(setUserCourseAction(uc));
            uiLogic(setActiveLoading(false));
          })
          .catch((e) => {
            console.error(e);
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
    // const token = getCookie(TOKEN);
    if (activeLoading || userCourseLoading) return;
    if (course.cost && (!userCourse || userCourse?.isExpired)) {
      dispatch(setActiveCourseModalVisibleAction(true));
    } else if (!course.cost && !userCourse) {
      uiLogic(setActiveLoading(true));
      apiJoinCourse({ courseId: course._id })
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
        <InfoCourse course={course} webInfo={webInfo} />
        <div style={{ backgroundColor: 'white' }}>
          <div className="container">
            <Row id="main-course-detail">
              <Col span={24} lg={16} className="course-detail">
                <Skeleton loading={userCourseLoading}>
                  <ContentCourse course={course} />
                  <div className="list-topic-tree-item">
                    <h2>Danh Sách Bài Học</h2>
                    <div className="course-topic-tree">
                      <CourseTopicTreeView course={course} />
                    </div>
                  </div>
                </Skeleton>
              </Col>
              <Col span={24} lg={8}>
                <InformationCourse course={course} />
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
