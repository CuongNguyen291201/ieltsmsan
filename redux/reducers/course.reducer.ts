import { Course } from '../../sub_modules/share/model/courses_ts';
import { CourseAction } from '../actions/course.actions';
import { ActionTypes, Scopes } from '../types';

export interface CourseState {
  currentCourse: Course;
  currentCourseLoading: boolean;
}

const initialState: CourseState = {
  currentCourse: null,
  currentCourseLoading: true
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

      default:
        return state;
    }
  }
  return state;
}
