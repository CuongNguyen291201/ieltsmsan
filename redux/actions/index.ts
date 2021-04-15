import { ActionTypes, Scopes } from '../types';

export interface BaseAction {
  scope: Scopes;
  type: string;
  payload?: any;
  target?: string;
}

export const loadList = (scope: Scopes, payload?: any, target?: string): BaseAction => ({
  type: ActionTypes.SUCCESS, scope, payload, target
});

export const failure = (scope: Scopes, payload?: any, target?: string): BaseAction => ({
  type: ActionTypes.FAILURE, scope, payload, target
});

