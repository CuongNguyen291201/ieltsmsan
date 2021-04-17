import { POST_REQ } from '../../sub_modules/common/api'
import { Course, ICourse } from '../../sub_modules/share/model/courses_ts'

export const apiGetPagedCoursesByCategory = (args: {
  categoryId: string;
  field?: keyof ICourse;
  asc?: boolean;
  limit?: number;
  lastRecord?: Course
}) => POST_REQ('get-paged-courses-by-category', args);