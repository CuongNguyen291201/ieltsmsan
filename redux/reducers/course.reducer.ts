import { USER_COURSE_APPROVE } from '../../sub_modules/share/constraint';
import { Course } from '../../sub_modules/share/model/courses';
import UserCourse from '../../sub_modules/share/model/userCourse';
import { CourseAction } from '../actions/course.actions';
import { ActionTypes, Scopes } from '../types';

export interface CourseState {
  currentCourse: Course;
  currentCourseLoading: boolean;
  courseId: string;
  removeCourseId: string;
  userCourse: UserCourse;
  isJoinedCourse: boolean;
  userCourseLoading: boolean;
  isVisibleActiveCourseModal: boolean;
}

const initialState: CourseState = {
  currentCourse: null,
  currentCourseLoading: true,
  courseId: null,
  removeCourseId: null,
  userCourse: null,
  isJoinedCourse: false,
  userCourseLoading: true,
  isVisibleActiveCourseModal: false
};

export function courseReducer(state = initialState, action: CourseAction): CourseState {
  if (action?.scope === Scopes.COURSE) {
    switch (action.type) {
      case ActionTypes.CRS_SET_CURRENT_COURSE:
        return {
          ...state,
          currentCourse: action.payload.course,
          currentCourseLoading: action.payload.isLoading
        };
      case ActionTypes.CRS_SET_ORDER_COURSE:
        return {
          ...state,
          courseId: action.payload.courseId,
        };
      case ActionTypes.CRS_REMOVE_ORDER_COURSE:
        return {
          ...state,
          removeCourseId: action.payload.courseId,
        };
      case ActionTypes.CRS_SET_USER_COURSE:
        return {
          ...state,
          userCourse: action.payload.userCourse,
          isJoinedCourse: (action.payload.userCourse as UserCourse)?.status === USER_COURSE_APPROVE,
          userCourseLoading: false
        }

      case ActionTypes.CRS_SET_ACTIVE_MODAL_VISIBLE:
        return {
          ...state,
          isVisibleActiveCourseModal: action.payload.isVisible
        }

      case ActionTypes.CRS_SET_USER_COURSE_LOADING:
        return {
          ...state,
          userCourseLoading: !!action.payload.userCourseLoading
        }
      default:
        return state;
    }
  }
  return state;
}
