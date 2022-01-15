import { _Topic } from '../../custom-types';
import MyCardData from '../../sub_modules/share/model/myCardData';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import { UserInfo } from '../../sub_modules/share/model/user';
import { TopicAction } from '../actions/topic.action';
import { ActionTypes, Scopes } from '../types';

export interface TopicState {
  mainTopics: Array<_Topic>;
  loadMoreMainTopics: boolean;
  error: boolean;
  currentTopic: _Topic | null;
  currentTopicLoading: boolean;
  studyScore: StudyScore | null;
  myCardData: MyCardData | null;
  isLoadedDetailTopic: boolean;
  userToReview: UserInfo | null;
  reviewCardData: MyCardData | null;
  mapLoadMoreState: { [x: string]: boolean; };
  boxCorrect: number;
  boxIncorrect: number;
  boxNone: number;
  boxMarked: number;
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
  mapLoadMoreState: {},
  boxCorrect: 0,
  boxIncorrect: 0,
  boxNone: 0,
  boxMarked: 0
};

export function topicReducer(state = initialState, action: TopicAction): TopicState {
  if (action?.scope === Scopes.TOPIC) {
    switch (action.type) {
      case ActionTypes.LOAD_LIST:
        return {
          ...state,
          mainTopics: [...state.mainTopics, ...action.payload.data],
          loadMoreMainTopics: action.payload.data.length >= (action.payload.limit ?? 20),
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
          ...getNumCardBox(myCardData, state.currentTopic),
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

      case ActionTypes.TP_RESET_TOPICS_LIST: {
        return {
          ...state,
          mainTopics: [],
          mapLoadMoreState: {},
          loadMoreMainTopics: false
        }
      }

      default:
        return state;
    }
  }
  return state;
}

// LOGIC

function getNumCardBox(myCardData: MyCardData, currentTopic: _Topic) {
  let cardCorrectArr: string[] = [];
  let cardIncorrectArr: string[] = [];
  let numCardNotAnswer = 0;
  let cardBookMark: string[] = []
  if (currentTopic?.topicExercise) {
    numCardNotAnswer = currentTopic.topicExercise.questionsNum;
  }
  if (myCardData) {
    const mapBoxNum: { [x: number]: string[] } = {};
    Object.keys(myCardData.boxCard).map((e: string) => {
      const boxNum = myCardData.boxCard[e] > 0 ? 1 : 0;
      mapBoxNum[boxNum] = [...mapBoxNum[boxNum] || [], e];
    });
    cardCorrectArr = mapBoxNum[1] ? mapBoxNum[1] : [];
    cardIncorrectArr = mapBoxNum[0] ? mapBoxNum[0] : [];
    numCardNotAnswer = numCardNotAnswer - cardCorrectArr.length - cardIncorrectArr.length;
    if (numCardNotAnswer < 0) {
      numCardNotAnswer = 0;
    }
    cardBookMark = myCardData.cardBookmarks ?? [];
  }
  return {
    boxCorrect: cardCorrectArr.length,
    boxIncorrect: cardIncorrectArr.length,
    boxNone: numCardNotAnswer,
    boxMarked: cardBookMark.length
  }
}
