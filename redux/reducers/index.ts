import { combineReducers } from 'redux';
import { categoryReducer, CategoryState } from './category.reducer';
import userReducer from '../../sub_modules/common/redux/reducers/userReducer';
// import { demoReducer, DemoState } from './demo.reducer';

export interface AppState {
  // demoReducer: DemoState
  categoryReducer: CategoryState,
  userReducer
}

export const rootReducer = combineReducers<AppState>({
  // demoReducer
  categoryReducer,
  userReducer
});