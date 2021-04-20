import { combineReducers } from 'redux';
import { categoryReducer, CategoryState } from './category.reducer';
import userReducer, { IUserState } from '../../sub_modules/common/redux/reducers/userReducer';
import { topicReducer, TopicState } from './topic.reducer';
import { courseReducer, CourseState } from './course.reducer';
import { prepareGameReducer, PrepareGameState } from './prepareGame.reducer';
import gameReducer, { IGameState } from '../../sub_modules/game/redux/reducers/gameReducer'

export interface AppState {
  categoryReducer: CategoryState;
  userReducer: IUserState;
  topicReducer: TopicState;
  courseReducer: CourseState;
  prepareGameReducer: PrepareGameState;
  gameReducer: IGameState
}

export const rootReducer = combineReducers<AppState>({
  categoryReducer,
  userReducer,
  topicReducer,
  courseReducer,
  prepareGameReducer,
  gameReducer
});