import { TopicAction } from '../actions/topic.action';
import { ActionTypes, Scopes } from '../types';

export interface TopicState {
  mainTopics: Array<any>;
  mainTopicsLoading: boolean;
  error: boolean;
}

const initialState: TopicState = {
  mainTopics: [],
  mainTopicsLoading: true,
  error: false
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

      default:
        return state;
    }
  }
  return state;
}