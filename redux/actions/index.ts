import { ActionTypes, Scopes } from '../types';

export interface BaseAction {
  scope: Scopes;
  type: string;
  payload?: any;
  target?: string;
}

export const loadListAction = (scope: Scopes, payload?: any, target?: string): BaseAction => ({
  type: ActionTypes.LOAD_LIST, scope, payload, target
});

export const failureAction = (scope: Scopes, payload?: any, target?: string): BaseAction => ({
  type: ActionTypes.FAILURE, scope, payload, target
});
