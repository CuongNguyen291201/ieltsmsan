import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _Topic } from "../../custom-types";
import { updateTopicExerciseAction } from '../../redux/actions/topic.action';
import { AppState } from '../../redux/reducers';
import { EXAM_TYPE_IELTS, EXAM_TYPE_TOEIC, TOPIC_CONTENT_TYPE_FLASH_CARD, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import { apiGetDataDetailExercise } from '../../utils/apis/topicApi';
import ExerciseInfoView from './ExerciseInfoView';
import ExamIELTSView from "./ExamIELTSView";
import TestInfoView from './TestInfoView';
import ExamTOEICView from "./ExamTOEICView";
import LoadingContainer from "../LoadingContainer";

const StudyInfoView = (props: { topic: _Topic }) => {
  const { topic } = props;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { studyScore, myCardData, isLoadedDetailTopic } = useSelector((state: AppState) => state.topicReducer);

  const parentId = useMemo(() => topic.parentId || topic.courseId, [topic]);

  useEffect(() => {
    async function getDataDetailExerciseFC() {
      const data = await apiGetDataDetailExercise({
        topicId: topic._id, userId: currentUser?._id ?? null, type: topic.type
      });
      if (!data) return;
      const { topicExercise, studyScore, myCardData } = data;
      dispatch(updateTopicExerciseAction(parentId, topicExercise, studyScore, myCardData));
    }
    getDataDetailExerciseFC();
  }, [currentUser, isLoadedDetailTopic]);

  const renderStudyView = () => {
    switch (topic.topicExercise?.contentType) {
      case EXAM_TYPE_IELTS:
        return topic.type === TOPIC_TYPE_TEST ? <ExamIELTSView topic={topic} /> : <ExerciseInfoView topic={topic} />
      case EXAM_TYPE_TOEIC:
        return <ExamTOEICView topic={topic} />
      default:
        return topic.type === TOPIC_TYPE_TEST
          ? <TestInfoView topic={topic} />
          : <ExerciseInfoView topic={topic} />
    }
  }

  return (
    <LoadingContainer loading={!isLoadedDetailTopic}>
      {renderStudyView()}
    </LoadingContainer>
  );
}

export default StudyInfoView;
