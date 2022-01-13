import { BaseAction } from '.';
import { _Topic } from "../../custom-types";
import MyCardData from '../../sub_modules/share/model/myCardData';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import Topic from '../../sub_modules/share/model/topic';
import { UserInfo } from '../../sub_modules/share/model/user';
import { ActionTypes, Scopes } from '../types';

export interface TopicAction extends BaseAction {
  scope: typeof Scopes.TOPIC
}

export const setCurrrentTopicAction = (topic: any, isLoading: boolean = false): TopicAction => ({
  scope: Scopes.TOPIC, type: ActionTypes.TP_SET_CURRENT_TOPIC, payload: { topic, isLoading }
})

export const updateTopicExerciseAction = (parentId: string, topicExercise: any, studyScore: StudyScore | null, myCardData: any): TopicAction => ({
  scope: Scopes.TOPIC, type: ActionTypes.TP_UPDATE_TOPIC_DETAIL_EXERCISE, payload: {
    parentId, topicExercise, studyScore, myCardData
  }
});

export const setUserCardDataAction = (args: { cardData: MyCardData; user: UserInfo }): TopicAction => ({
  scope: Scopes.TOPIC, type: ActionTypes.TP_SET_USER_CARD_DATA, payload: args
});

export const fetchTopicsAction = (args: { courseId: string; parentId: string | null; limit?: number; skip?: number; field: string; userId?: string; asc?: boolean }): TopicAction => ({
  scope: Scopes.TOPIC, type: ActionTypes.TP_FETCH_TOPICS, payload: args
});

export const setLoadMoreChildTopicsAction = (args: { topicId: string; isLoadMore: boolean }): TopicAction => ({
  scope: Scopes.TOPIC, type: ActionTypes.TP_SET_LOAD_MORE_CHILD_TOPICS, payload: args
});

export const resetTopicsListAction = (): TopicAction => ({
  scope: Scopes.TOPIC, type: ActionTypes.TP_RESET_TOPICS_LIST
});

export const fetchCourseSectionsAction = (args: { courseId: string; userId?: string }): TopicAction => ({
  scope: Scopes.TOPIC, type: ActionTypes.TP_FETCH_SECTIONS, payload: args
});
