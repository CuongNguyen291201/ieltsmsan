import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTopicExerciseAction } from '../../redux/actions/topic.action';
import { AppState } from '../../redux/reducers';
import { TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import { apiGetDataDetailExercise } from '../../utils/apis/topicApi';
import TestInfoView from './TestInfoView';
import ExerciseInfoView from './ExerciseInfoView';
import PreGameView from './PreGameView';
import PanelContainer from '../containers/PanelContainer';

const StudyInfoView = (props: { topic: any }) => {
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

    if (currentUser) {
      getDataDetailExerciseFC();
    } else {
      dispatch(updateTopicExerciseAction(parentId, null, null, null));
    }
  }, [currentUser]);

  return (
    <>
      {
        !isLoadedDetailTopic
          ? <div>Loading...</div>
          : (
            <PanelContainer title={''}>
              {studyScore
                ? (
                  topic.type === TOPIC_TYPE_TEST
                    ? <TestInfoView topic={topic} />
                    : <ExerciseInfoView topic={topic} />
                )
                : <PreGameView topic={topic} />}
            </PanelContainer>
          )
      }
    </>
  );
}

export default StudyInfoView;
