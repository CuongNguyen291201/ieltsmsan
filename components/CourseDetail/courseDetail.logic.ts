import { USER_COURSE_APPROVE } from '../../sub_modules/share/constraint';
import UserCourse from '../../sub_modules/share/model/userCourse';

// Action Types
enum ActionTypes {
  SET_ACTIVE_TAB = 'SET_ACTIVE_TAB',
  SET_USER_COURSE = 'SET_USER_COURSE',
  SET_LOADING = 'SET_LOADING'
}

interface CourseDetailAction {
  type: ActionTypes;
  activeTab?: number;
  userCourse?: UserCourse;
  isLoading?: boolean;
  loadTarget?: keyof CourseDetailState;
}

// States

export enum CourseTab {
  COURSE_CONTENT, COURSE_TOPIC_TREE
}

type CourseDetailState = {
  activeTab: CourseTab;
  userCourse: UserCourse | null;
  activeLoading: boolean;
  userCourseLoading: boolean;
  isJoin: boolean;
}

export const courseDetailInitState: CourseDetailState = {
  activeTab: CourseTab.COURSE_CONTENT,
  userCourse: null,
  activeLoading: false,
  userCourseLoading: false,
  isJoin: false
}

// Reducers

export function courseDetailReducer(state: CourseDetailState = courseDetailInitState, action: CourseDetailAction): CourseDetailState {
  switch (action.type) {
    case ActionTypes.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.activeTab
      }
    case ActionTypes.SET_USER_COURSE:
      return {
        ...state,
        userCourse: action.userCourse,
        isJoin: action.userCourse?.status === USER_COURSE_APPROVE
      }
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        [action.loadTarget || 'activeLoading']: action.isLoading
      }
  }
}

// Action Creators

export const setActiveTab = (tab: number): CourseDetailAction => ({
  type: ActionTypes.SET_ACTIVE_TAB,
  activeTab: tab
});

export const setUserCourse = (userCourse: UserCourse): CourseDetailAction => ({
  type: ActionTypes.SET_USER_COURSE,
  userCourse
})

export const setLoading = (isLoading: boolean, target: keyof CourseDetailState): CourseDetailAction => ({
  type: ActionTypes.SET_LOADING,
  isLoading,
  loadTarget: target
});
