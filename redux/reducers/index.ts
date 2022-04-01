import { combineReducers } from 'redux';
import userReducer, { IUserState } from '../../sub_modules/common/redux/reducers/userReducer';
import documentModuleReducers from '../../sub_modules/document/src/redux/reducers';
import { DocumentModuleState } from '../../sub_modules/document/src/redux/state';
import gameReducer, { IGameState } from '../../sub_modules/game/redux/reducers/gameReducer';
import categorySlice, { CategorySliceState } from "../slices/category.slice";
import courseSlice, { CourseSliceState } from "../slices/course.slice";
import { cartReducer, CartState } from './cart.reducer';
import { categoryReducer, CategoryState } from './category.reducer';
// import scenarioReducer, { ScenarioState } from '../../sub_modules/scenario/src/redux/reducers/scenario.reducers';
import { commentReducer, CommentState } from './comment.reducers';
import { contentReducer, ContentState } from "./content.reducer";
import { courseReducer, CourseState } from './course.reducer';
import { topicDocumentReducer, TopicDocumentState } from "./document.reducer";
import { examReducer, ExamState } from "./exam.reducer";
import { menuReducer, MenuState } from "./menu.reducer";
import { prepareGameReducer, PrepareGameState } from './prepareGame.reducer';
import { topicReducer, TopicState } from './topic.reducer';


export interface AppState {
  categoryReducer: CategoryState;
  userReducer: IUserState;
  topicReducer: TopicState;
  courseReducer: CourseState;
  prepareGameReducer: PrepareGameState;
  gameReducer: IGameState;
  // scenarioReducer: ScenarioState;
  commentReducer: CommentState;
  documentState: DocumentModuleState;
  cartReducer: CartState;
  examReducer: ExamState;
  menuReducer: MenuState;
  topicDocumentReducer: TopicDocumentState;
  contentReducer: ContentState;
  courseSlice: CourseSliceState;
  categorySlice: CategorySliceState;
}

export const rootReducer = combineReducers<AppState>({
  categoryReducer,
  userReducer,
  topicReducer,
  courseReducer,
  prepareGameReducer,
  gameReducer,
  // scenarioReducer,
  commentReducer,
  documentState: documentModuleReducers,
  cartReducer,
  examReducer,
  menuReducer,
  topicDocumentReducer,
  contentReducer,
  courseSlice,
  categorySlice
});