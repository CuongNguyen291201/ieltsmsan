import { BaseAction } from '.';
import { ActionTypes, Scopes } from '../types';

export interface DemoAction extends BaseAction {
  scope: typeof Scopes.DEMO
}

export const actIncrement = () => ({ scope: Scopes.DEMO, type: ActionTypes.DEMO_INCREMENT });

export const actDecrement = () => ({ scope: Scopes.DEMO, type: ActionTypes.DEMO_DECREMENT });

export const actSetValueAsync = (value: number) => ({ scope: Scopes.DEMO, type: ActionTypes.DEMO_SET_ASYNC, payload: value });
