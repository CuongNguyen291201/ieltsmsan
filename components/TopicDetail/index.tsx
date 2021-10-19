import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { setUserCourseAction } from '../../redux/actions/course.actions';
import { AppState } from '../../redux/reducers';
import { showToastifyWarning } from '../../sub_modules/common/utils/toastify';
import { TOPIC_TYPE_LESSON } from '../../sub_modules/share/constraint';
import { Course } from '../../sub_modules/share/model/courses';
import Topic from '../../sub_modules/share/model/topic';
import WebInfo from '../../sub_modules/share/model/webInfo';
import { apiGetUserCourse } from '../../utils/apis/courseApi';
import { InfoCourse } from '../CourseDetail/InfoCourse';
import LessonInfoView from './LessonInfoView';
import StudyInfoView from './StudyInfoView';
import './style.scss';

const TopicDetail = (props: { topic: Topic; course: Course, webInfo?: WebInfo }) => {
  const { topic, course, webInfo } = props;
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!currentUser) {
      dispatch(setUserCourseAction(null));
    } else {
      apiGetUserCourse({ courseId: topic.courseId })
        .then((uc) => {
          dispatch(setUserCourseAction(uc));
        })
        .catch((e) => {
          showToastifyWarning("Có lỗi xảy ra!");
        })
    }
  }, [currentUser]);

  useScrollToTop();
  return (
    <div className="wraper-page">
      <InfoCourse course={topic.course} webInfo={webInfo} topic={topic} />
      <div className="topic-detail">
        <div className="container">
          <div className="short-description">
            {topic.shortDescription}
          </div>
          {
            topic.type === TOPIC_TYPE_LESSON
              ? <LessonInfoView topic={topic} />
              : <StudyInfoView topic={topic} />
          }
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;