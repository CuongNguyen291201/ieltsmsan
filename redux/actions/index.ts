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

export const createOneAction = (scope: Scopes, payload?: any): BaseAction => ({
  type: ActionTypes.CREATE_ONE, scope, payload
});

export const removeOneAction = (scope: Scopes, payload?: any): BaseAction => ({
  type: ActionTypes.REMOVE_ONE, scope, payload
})
