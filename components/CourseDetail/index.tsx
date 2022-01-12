import { Grid } from "@mui/material";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { setUserCourseAction, setUserCourseLoadingAction } from '../../redux/actions/course.actions';
import { AppState } from '../../redux/reducers';
import { showToastifyWarning } from '../../sub_modules/common/utils/toastify';
import { apiGetUserCourse } from '../../utils/apis/courseApi';
import CourseLayout from "../CourseLayout";
import LoadingContainer from "../LoadingContainer";
import ContentCourse from './CourseContent';
import CourseTopicTreeView from './CourseTopicTreeView';
import { InformationCourse } from './InformationCourse/information-course';
import './style.scss';

const CourseDetail = () => {
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { currentCourseLoading, currentCourse: course, userCourseLoading } = useSelector((state: AppState) => state.courseReducer);
  const dispatch = useDispatch();

  useScrollToTop();

  useEffect(() => {
    if (!!currentUser && !!course) {
      apiGetUserCourse({ courseId: course._id })
        .then((uc) => {
          dispatch(setUserCourseAction(uc));
        })
        .catch((e) => {
          console.error(e);
          showToastifyWarning('Có lỗi xảy ra!');
        });
    } else {
      dispatch(setUserCourseAction(null));
    }
  }, [currentUser, course]);

  return (
    <>
      <LoadingContainer loading={currentCourseLoading || userCourseLoading}>
        <CourseLayout course={course}>
          <Grid container id="main-course-detail" columnSpacing={2}>
            <Grid item xs={12} md={8} className="course-detail">
              <ContentCourse course={course} />
              <div className="list-topic-tree-item">
                <h2>Danh Sách Bài Học</h2>
                <CourseTopicTreeView />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <InformationCourse course={course} />
            </Grid>
          </Grid>
        </CourseLayout>
      </LoadingContainer>
    </>
  )
}

export default CourseDetail;
