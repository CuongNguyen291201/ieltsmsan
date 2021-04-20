import { StudyScore } from '../../sub_modules/share/model/studyScore';
import { TopicAction } from '../actions/topic.action';
import { ActionTypes, Scopes } from '../types';

export interface TopicState {
  mainTopics: Array<any>;
  mainTopicsLoading: boolean;
  error: boolean;
  currentTopic: any;
  currentTopicLoading: boolean;
  studyScore: StudyScore | null;
  myCardData: any;
  isLoadedDetailTopic: boolean;
}

const initialState: TopicState = {
  mainTopics: [],
  mainTopicsLoading: true,
  error: false,
  currentTopic: null,
  currentTopicLoading: true,
  studyScore: null,
  myCardData: null,
  isLoadedDetailTopic: false
}

export function topicReducer(state = initialState, action: TopicAction): TopicState {
  if (action?.scope === Scopes.TOPIC) {
    switch (action.type) {
      case ActionTypes.LOAD_LIST:
        return {
          ...state,
          [action.target]: action.payload,
          [`${action.target}Loading`]: false
        }

      case ActionTypes.FAILURE:
        return {
          ...state,
          error: true
        }

      case ActionTypes.TP_SET_CURRENT_TOPIC:
        return {
          ...state,
          currentTopic: action.payload.topic,
          currentTopicLoading: action.payload.isLoading
        }

      case ActionTypes.TP_UPDATE_TOPIC_DETAIL_EXERCISE:
        const { topicExercise, studyScore, myCardData } = action.payload;
        if (state.currentTopic && topicExercise) {
          state.currentTopic.topicExercise = topicExercise
        }
        return {
          ...state,
          studyScore,
          myCardData,
          isLoadedDetailTopic: true
        }

      default:
        return state;
    }
  }
  return state;
}