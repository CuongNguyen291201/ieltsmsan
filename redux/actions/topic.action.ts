import { BaseAction } from '.';
import { ActionTypes, Scopes } from '../types';

export interface TopicAction extends BaseAction {
  scope: typeof Scopes.TOPIC
}

export const fetchMainTopicsAction = (args: {
  userId?: string; courseId: string;
}): TopicAction => ({
  scope: Scopes.TOPIC, type: ActionTypes.TP_FETCH_MAIN_TOPICS, payload: args
});