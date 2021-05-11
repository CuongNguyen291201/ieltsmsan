import { POST_API, POST_REQ } from '../../sub_modules/common/api'
import { Course, ICourse } from '../../sub_modules/share/model/courses'

export const apiSeekCoursesByCategory = (args: {
  categoryId: string;
  field?: keyof ICourse;
  asc?: boolean;
  limit?: number;
  lastRecord?: Course
}) => POST_REQ('seek-courses-by-category', args);

export const apiOffsetCoursesByCategory = (args: {
  categoryId: string;
  field?: keyof ICourse;
  asc?: boolean;
  limit?: number;
  skip?: number
}) => POST_REQ('offset-courses-by-category', args);

export const apiGetCourseById = (courseId: string) => POST_API('get-course-by-id', { courseId });
