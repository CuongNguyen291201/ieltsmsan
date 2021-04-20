import { POST_API, POST_REQ } from '../../sub_modules/common/api'
import { Course, ICourse } from '../../sub_modules/share/model/courses_ts'

export const apiGetPagedCoursesByCategory = (args: {
  categoryId: string;
  field?: keyof ICourse;
  asc?: boolean;
  limit?: number;
  lastRecord?: Course
}) => POST_REQ('get-paged-courses-by-category', args);

export const apiGetSkippedCoursesByCategory = (args: {
  categoryId: string;
  field?: keyof ICourse;
  asc?: boolean;
  limit?: number;
  skip?: number
}) => POST_REQ('get-skipped-courses-by-category', args);

export const apiGetCourseById = (courseId: string) => POST_API('get-course-by-id', { courseId });
