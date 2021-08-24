import { USER_COURSE_APPROVE } from '../../sub_modules/share/constraint';
import UserCourse from '../../sub_modules/share/model/userCourse';

// Action Types
enum ActionTypes {
  SET_ACTIVE_TAB = 'SET_ACTIVE_TAB',
  SET_ACTIVE_LOADING = 'SET_ACTIVE_LOADING'
}

interface CourseDetailAction {
  type: ActionTypes;
  activeTab?: number;
  isLoading?: boolean;
}

// States

export enum CourseTab {
  COURSE_TAB_NONE, COURSE_CONTENT, COURSE_TOPIC_TREE, COURSE_MEMBER
}

type CourseDetailState = {
  activeTab: CourseTab;
  activeLoading: boolean;
}

export const courseDetailInitState: CourseDetailState = {
  activeTab: CourseTab.COURSE_TAB_NONE,
  activeLoading: false
}

// Reducers

export function courseDetailReducer(state: CourseDetailState = courseDetailInitState, action: CourseDetailAction): CourseDetailState {
  switch (action.type) {
    case ActionTypes.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.activeTab
      }

    case ActionTypes.SET_ACTIVE_LOADING:
      return {
        ...state,
        activeLoading: action.isLoading
      }
  }
}

// Action Creators

export const setActiveTab = (tab: number): CourseDetailAction => ({
  type: ActionTypes.SET_ACTIVE_TAB,
  activeTab: tab
});

export const setActiveLoading = (isLoading: boolean): CourseDetailAction => ({
  type: ActionTypes.SET_ACTIVE_LOADING,
  isLoading
});
