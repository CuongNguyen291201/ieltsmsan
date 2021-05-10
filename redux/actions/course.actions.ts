import { BaseAction } from '.';
import { Course } from '../../sub_modules/share/model/courses';
import { ActionTypes, Scopes } from '../types';

export interface CourseAction extends BaseAction {
  scope: typeof Scopes.COURSE;
}

export const setCurrentCourseAction = (course: Course | null, isLoading: boolean = false): CourseAction => ({
  scope: Scopes.COURSE, type: ActionTypes.CRS_SET_CURRENT_COURSE, payload: { course, isLoading }
});