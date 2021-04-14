import { combineReducers } from 'redux';
import { categoryReducer, CategoryState } from './category.reducer';
// import { demoReducer, DemoState } from './demo.reducer';

export interface AppState {
  // demoReducer: DemoState
  categoryReducer: CategoryState
}

export const rootReducer = combineReducers<AppState>({
  // demoReducer
  categoryReducer
});