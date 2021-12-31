import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { setUserCourseAction, setUserCourseLoadingAction } from '../../redux/actions/course.actions';
import { updateTopicExerciseAction } from "../../redux/actions/topic.action";
import { AppState } from '../../redux/reducers';
import { showToastifyWarning } from '../../sub_modules/common/utils/toastify';
import { EXAM_TYPE_IELTS, EXAM_TYPE_TOEIC, TOPIC_CONTENT_TYPE_FLASH_CARD, TOPIC_TYPE_EXERCISE, TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST } from "../../sub_modules/share/constraint";
import { apiGetUserCourse } from '../../utils/apis/courseApi';
import { apiGetDataDetailExercise } from "../../utils/apis/topicApi";
import { canPlayTopic } from "../../utils/permission/topic.permission";
import CourseLayout from "../CourseLayout";
import LoadingContainer from "../LoadingContainer";
import LoadingUI from "../LoadingUI";
import ExamIELTSView from "./ExamIELTSView";
import ExamTOEICView from "./ExamTOEICView";
import ExerciseInfoView from "./ExerciseInfoView";
import LessonView from "./LessonView";
import TestInfoView from "./TestInfoView";
import TopicPrivateView from "./TopicPrivateView";
import TopicUnauthView from "./TopicUnauthView";

const TopicDetail = () => {
  const { currentTopic: topic, currentTopicLoading } = useSelector((state: AppState) => state.topicReducer);
  const { currentCourse: course, userCourseLoading, currentCourseLoading, isJoinedCourse } = useSelector((state: AppState) => state.courseReducer);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const dispatch = useDispatch();

  useScrollToTop();

  useEffect(() => {
    if (!currentTopicLoading) {
      dispatch(setUserCourseLoadingAction(true));
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
    }
  }, [currentUser, currentTopicLoading, topic]);

  useEffect(() => {
    const getDataDetailExerciseFC = async () => {
      const data = await apiGetDataDetailExercise({
        topicId: topic._id, userId: currentUser?._id ?? null, type: topic.type
      });
      if (!data) return;
      const { topicExercise, studyScore, myCardData } = data;
      dispatch(updateTopicExerciseAction(topic._id, topicExercise, studyScore, myCardData));
    }
    if (topic && topic.type !== TOPIC_TYPE_LESSON) getDataDetailExerciseFC();
  }, [currentUser, topic]);

  const renderTopicView = () => {
    if (!topic || userCourseLoading || currentTopicLoading) return <></>;
    if (topic.type === TOPIC_TYPE_TEST && topic.topicExercise?.contentType === EXAM_TYPE_IELTS) {
      return <ExamIELTSView />
    } else if (topic.type === TOPIC_TYPE_TEST && topic.topicExercise?.contentType === EXAM_TYPE_TOEIC) {
      return <ExamTOEICView />
    } else if (topic.type === TOPIC_TYPE_EXERCISE && topic.topicExercise?.contentType === TOPIC_CONTENT_TYPE_FLASH_CARD) {
      return <ExerciseInfoView />
    } else {
      if (topic.type === TOPIC_TYPE_TEST) {
        return <TestInfoView />
      } else if (topic.type === TOPIC_TYPE_EXERCISE) {
        return <ExerciseInfoView />
      } else if (topic.type === TOPIC_TYPE_LESSON) {
        return <LessonView />
      }
      return <></>
    }
  }

  return (
    <LoadingContainer loading={currentTopicLoading || currentCourseLoading || userCourseLoading}>
      <CourseLayout course={course} topic={topic}>
        {renderTopicView()}
      </CourseLayout>
    </LoadingContainer>
  );
};

export default TopicDetail;