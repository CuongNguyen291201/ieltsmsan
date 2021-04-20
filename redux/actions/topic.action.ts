import { BaseAction } from '.';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import { ActionTypes, Scopes } from '../types';

export interface TopicAction extends BaseAction {
  scope: typeof Scopes.TOPIC
}

export const fetchMainTopicsAction = (args: {
  userId?: string; courseId: string;
}): TopicAction => ({
  scope: Scopes.TOPIC, type: ActionTypes.TP_FETCH_MAIN_TOPICS, payload: args
});

export const setCurrrentTopicAction = (topic: any, isLoading: boolean = false): TopicAction => ({
  scope: Scopes.TOPIC, type: ActionTypes.TP_SET_CURRENT_TOPIC, payload: { topic, isLoading }
})

export const updateTopicExerciseAction = (parentId: string, topicExercise: any, studyScore: StudyScore | null, myCardData: any): TopicAction => ({
  scope: Scopes.TOPIC, type: ActionTypes.TP_UPDATE_TOPIC_DETAIL_EXERCISE, payload: {
    parentId, topicExercise, studyScore, myCardData
  }
});