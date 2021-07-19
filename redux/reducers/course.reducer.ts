import { Course } from '../../sub_modules/share/model/courses';
import { CourseAction } from '../actions/course.actions';
import { ActionTypes, Scopes } from '../types';

export interface CourseState {
  currentCourse: Course;
  currentCourseLoading: boolean;
  courseId: string;
  removeCourseId: string;
}

const initialState: CourseState = {
  currentCourse: null,
  currentCourseLoading: true,
  courseId: null,
  removeCourseId: null,
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
      default:
        return state;
    }
  }
  return state;
}
