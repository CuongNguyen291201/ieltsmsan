import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommentScopes } from '../../custom-types';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { setUserCourseAction } from '../../redux/actions/course.actions';
import { AppState } from '../../redux/reducers';
import { getCookie, TOKEN } from '../../sub_modules/common/utils/cookie';
import { showToastifyWarning } from '../../sub_modules/common/utils/toastify';
import { STATUS_OPEN, TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import { Course } from '../../sub_modules/share/model/courses';
import Topic from '../../sub_modules/share/model/topic';
import WebInfo from '../../sub_modules/share/model/webInfo';
import { apiGetUserCourse } from '../../utils/apis/courseApi';
import { canPlayTopic } from '../../utils/permission/topic.permission';
import { ROUTER_NOT_FOUND } from '../../utils/router';
import CommentPanel from '../CommentPanel';
import PanelContainer from '../containers/PanelContainer';
import { InfoCourse } from '../CourseDetail/InfoCourse';
import LessonInfoView from './LessonInfoView';
import StudyInfoView from './StudyInfoView';
import './style.scss';
import TopicRankingsView from './TopicRankingsView';

const TopicDetail = (props: { topic: Topic; course: Course, webInfo?: WebInfo }) => {
  const { topic, course, webInfo } = props;
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { isJoinedCourse, userCourseLoading, currentCourseLoading } = useSelector((state: AppState) => state.courseReducer);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!currentUser) {
      return;
    } else {
      // const token = getCookie(TOKEN);
      apiGetUserCourse({ courseId: topic.courseId })
        .then((uc) => {
          dispatch(setUserCourseAction(uc));
        })
        .catch((e) => {
          showToastifyWarning("Có lỗi xảy ra!");
        })
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentCourseLoading) {
      if (!!currentUser) {
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
    }
  }, [currentUser, currentCourseLoading]);

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
          {/* {topic.type === TOPIC_TYPE_TEST && <PanelContainer title="Bảng xếp hạng">
            <TopicRankingsView topic={topic} />
          </PanelContainer>} */}

          {/* <PanelContainer title="Bình luận">
          <CommentPanel commentScope={CommentScopes.TOPIC} />
        </PanelContainer> */}

        </div>
      </div>
    </div>
  );
};

export default TopicDetail;