import { combineReducers } from 'redux';
import { categoryReducer, CategoryState } from './category.reducer';
import userReducer, { IUserState } from '../../sub_modules/common/redux/reducers/userReducer';
import { topicReducer, TopicState } from './topic.reducer';
import { courseReducer, CourseState } from './course.reducer';
import { prepareGameReducer, PrepareGameState } from './prepareGame.reducer';
import gameReducer, { IGameState } from '../../sub_modules/game/redux/reducers/gameReducer';
import scenarioReducer, { ScenarioState } from '../../sub_modules/scenario/src/redux/reducers/scenario.reducers';
import { commentReducer, CommentState } from './comment.reducers';
import documentModuleReducers from '../../sub_modules/document/src/redux/reducers';
import { DocumentModuleState } from '../../sub_modules/document/src/redux/state';


export interface AppState {
  categoryReducer: CategoryState;
  userReducer: IUserState;
  topicReducer: TopicState;
  courseReducer: CourseState;
  prepareGameReducer: PrepareGameState;
  gameReducer: IGameState;
  scenarioReducer: ScenarioState;
  commentReducer: CommentState;
  documentReducer: DocumentModuleState
}

export const rootReducer = combineReducers<AppState>({
  categoryReducer,
  userReducer,
  topicReducer,
  courseReducer,
  prepareGameReducer,
  gameReducer,
  scenarioReducer,
  commentReducer,
  documentReducer: documentModuleReducers
});