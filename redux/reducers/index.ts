import { combineReducers } from 'redux';
import { demoReducer, DemoState } from './demo.reducer';

export interface AppState {
  demoReducer: DemoState
}

export const rootReducer = combineReducers<AppState>({
  demoReducer
});