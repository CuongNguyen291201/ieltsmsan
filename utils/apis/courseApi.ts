import { POST_API, POST_REQ, GET_API } from '../../sub_modules/common/api'
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
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

export const apiGetCourseById = (courseId: string) => POST_API('get-course-by-id', { courseId, isLoadFull: true });

export const apiCountCategoryCourses = async (args: { categoryId: string; isRoot?: boolean }): Promise<{ total: number; }> => {
  try {
    const { data, status } = await POST_API('count-category-courses', args);
    if (status === response_status_codes.success) return data;
    return { total: 0 };
  } catch (e) {
    return { total: 0 };
  }
}

export const apiGetAllCourse = () => GET_API('get-all-courses');

