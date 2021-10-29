import { BaseAction } from '.';
import { Course } from '../../sub_modules/share/model/courses';
import UserCourse from '../../sub_modules/share/model/userCourse';
import { ActionTypes, Scopes } from '../types';

export interface CourseAction extends BaseAction {
  scope: typeof Scopes.COURSE;
}

export const setCurrentCourseAction = (course: Course | null, isLoading: boolean = false): CourseAction => ({
  scope: Scopes.COURSE, type: ActionTypes.CRS_SET_CURRENT_COURSE, payload: { course, isLoading }
});

export const setCourseOrderAction = (courseId: string): CourseAction => ({
  scope: Scopes.COURSE, type: ActionTypes.CRS_SET_ORDER_COURSE, payload: { courseId }
});
export const removeCourseOrderAction = (courseId: string): CourseAction => ({
  scope: Scopes.COURSE, type: ActionTypes.CRS_REMOVE_ORDER_COURSE, payload: { courseId }
});

export const setUserCourseAction = (userCourse: UserCourse | null): CourseAction => ({
  scope: Scopes.COURSE, type: ActionTypes.CRS_SET_USER_COURSE, payload: { userCourse }
});

export const setActiveCourseModalVisibleAction = (isVisible: boolean): CourseAction => ({
  scope: Scopes.COURSE, type: ActionTypes.CRS_SET_ACTIVE_MODAL_VISIBLE, payload: { isVisible }
});

export const setUserCourseLoadingAction = (userCourseLoading: boolean): CourseAction => ({
  scope: Scopes.COURSE, type: ActionTypes.CRS_SET_USER_COURSE_LOADING, payload: { userCourseLoading }
})
