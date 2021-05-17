import MyCardData from '../../sub_modules/share/model/myCardData';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import Topic from '../../sub_modules/share/model/topic';
import { UserInfo } from '../../sub_modules/share/model/user';
import { TopicAction } from '../actions/topic.action';
import { ActionTypes, Scopes } from '../types';

export interface TopicState {
  mainTopics: Array<Topic>;
  loadMoreMainTopics: boolean;
  error: boolean;
  currentTopic: Topic | null;
  currentTopicLoading: boolean;
  studyScore: StudyScore | null;
  myCardData: MyCardData | null;
  isLoadedDetailTopic: boolean;
  userToReview: UserInfo | null;
  reviewCardData: MyCardData | null;
  mapLoadMoreState: { [x: string]: boolean; };
}

const initialState: TopicState = {
  mainTopics: [],
  loadMoreMainTopics: false,
  error: false,
  currentTopic: null,
  currentTopicLoading: true,
  studyScore: null,
  myCardData: null,
  isLoadedDetailTopic: false,
  userToReview: null,
  reviewCardData: null,
  mapLoadMoreState: {}
};

export function topicReducer(state = initialState, action: TopicAction): TopicState {
  if (action?.scope === Scopes.TOPIC) {
    switch (action.type) {
      case ActionTypes.LOAD_LIST:
        return {
          ...state,
          mainTopics: [...state.mainTopics, ...action.payload.data],
          loadMoreMainTopics: action.payload.data.length >= (action.payload.limit ?? 20)
        };

      case ActionTypes.FAILURE:
        return {
          ...state,
          error: true
        };

      case ActionTypes.TP_SET_CURRENT_TOPIC:
        return {
          ...state,
          currentTopic: action.payload.topic,
          currentTopicLoading: action.payload.isLoading
        };

      case ActionTypes.TP_UPDATE_TOPIC_DETAIL_EXERCISE:
        const { topicExercise, studyScore, myCardData } = action.payload;
        if (state.currentTopic && topicExercise) {
          state.currentTopic.topicExercise = topicExercise;
        }
        return {
          ...state,
          studyScore,
          myCardData,
          isLoadedDetailTopic: true
        };

      case ActionTypes.TP_SET_USER_CARD_DATA:
        return {
          ...state,
          userToReview: action.payload.user,
          reviewCardData: action.payload.cardData,

        };

      case ActionTypes.TP_SET_LOAD_MORE_CHILD_TOPICS:
        return {
          ...state,
          mapLoadMoreState: {
            ...state.mapLoadMoreState,
            [action.payload.topicId]: action.payload.isLoadMore
          }
        };

      default:
        return state;
    }
  }
  return state;
}