import { Grid } from "@material-ui/core";
import { useRouter } from 'next/router';
import { useEffect, useMemo, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { setActiveCourseModalVisibleAction, setUserCourseAction, setUserCourseLoadingAction } from '../../redux/actions/course.actions';
import { AppState } from '../../redux/reducers';
import { showToastifyWarning } from '../../sub_modules/common/utils/toastify';
import { Course } from '../../sub_modules/share/model/courses';
import WebInfo from '../../sub_modules/share/model/webInfo';
import { apiGetUserCourse } from '../../utils/apis/courseApi';
import ActiveCourseModal from '../ActiveCourseModal';
import SkeletonContainer from "../SkeletonContainer";
import { ContentCourse } from './content-course';
import {
  courseDetailInitState,
  courseDetailReducer, setActiveLoading
} from './courseDetail.logic';
import CourseTopicTreeView from './CourseTopicTreeView';
import { InfoCourse } from './InfoCourse';
import { InformationCourse } from './InformationCourse/information-course';
import './style.scss';

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
    dispatch(setUserCourseLoadingAction(true));
    if (!!currentUser) {
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
  }, [currentUser]);

  return (
    <>
      <div className="wraper-container">
        <InfoCourse course={course} webInfo={webInfo} />
        <div style={{ backgroundColor: 'white' }}>
          <div className="container">
            <Grid container id="main-course-detail">
              <Grid item xs={12} md={8} className="course-detail">
                <SkeletonContainer noTransform loading={currentCourseLoading}>
                  <ContentCourse course={course} />
                  <div className="list-topic-tree-item">
                    <h2>Danh Sách Bài Học</h2>
                    <div className="course-topic-tree">
                      <CourseTopicTreeView course={course} />
                    </div>
                  </div>
                </SkeletonContainer>
              </Grid>
              <Grid item xs={12} md={4}>
                <InformationCourse course={course} />
              </Grid>
            </Grid>
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
