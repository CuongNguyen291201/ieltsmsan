import { ActionTypes, Scopes } from '../types';

export interface BaseAction {
  scope: Scopes;
  type: string;
  payload?: any;
}

export const success = (scope: Scopes, payload?: any): BaseAction => ({
  type: ActionTypes.SUCCESS, scope, payload
});

export const failure = (scope: Scopes, payload?: any): BaseAction => ({
  type: ActionTypes.FAILURE, scope, payload
});

