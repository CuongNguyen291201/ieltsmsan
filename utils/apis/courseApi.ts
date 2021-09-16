import { MapActiveCourseErrorStatus } from '../../custom-types/MapContraint';
import { GET_API, POST_API, POST_REQ } from '../../sub_modules/common/api';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import { Course, ICourse } from '../../sub_modules/share/model/courses';
import UserCourse, { IUserCourse } from '../../sub_modules/share/model/userCourse';

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

export const apiGetCourseById = async (courseId: string): Promise<Course | null> => {
  const { data, status } = await POST_API('get-course-by-id', { courseId, isLoadFull: true });
  if (status === response_status_codes.success) return data;
  return null;
}

export const apiCountCategoryCourses = async (args: { categoryId: string; isRoot?: boolean }): Promise<{ total: number; }> => {
  const { data, status } = await POST_API('count-category-courses', args);
  if (status === response_status_codes.success) return data;
  return { total: 0 };
}

export const apiGetAllCourse = () => GET_API('get-all-courses');

export const apiGetCourseByIds = async (courseIds: string[]): Promise<Course[]> => {
  const { data, status } = await POST_API('get-courses-by-ids', { courseIds });
  if (status !== response_status_codes.success) return [];
  return data;
}

export const apiGetMyCourses = async (userId: string): Promise<UserCourse[]> => {
  const res = await POST_API('get-user-courses', { userId });
  return res.data;
}

export const apiLoadCourseByCode = async (code: string): Promise<{ courses?: Course[]; activedIds?: string[] }> => {
  const { data, status } = await POST_API('load-courses-by-code', { code })
  if (status !== response_status_codes.success) return {};
  return data;
}
export const apiGetCodeInfo = (code: string): any => POST_API('get-code-info', { code })
export const apiActiveCode = async (body: { code: string, token: string, courseId: string }): Promise<UserCourse | null> => {
  const { data, status } = await POST_API('active-course-by-code', body);
  if (status !== response_status_codes.success) return null;

  if (!!data?.data?.error) {
    const errCode = data.data.error;
    const errMsg = MapActiveCourseErrorStatus[errCode] || 'Có lỗi xảy ra!';
    throw new Error(errMsg);
  }
  return data;
}
export const apiGetCoursesActivedByUser = (body: { userId: string }): any => POST_API('get-courses_actived_by_user', body)

export const apiGetUserCourse = async (args: { token: string; courseId: string }): Promise<UserCourse | null> => {
  const { data, status } = await POST_API('get-user-course', args);
  if (status !== response_status_codes.success) return null;
  return data;
}

export const apiJoinCourse = async (args: { token: string; courseId: string }): Promise<UserCourse | null> => {
  const { data, status } = await POST_API('join-course', args);
  if (status !== response_status_codes.success) return null;
  return data;
}

export const apiGetCourseMembers = async (args: {
  token: string;
  courseId: string;
  skip?: number;
  limit?: number;
  field: keyof IUserCourse;
  asc?: boolean;
  status?: number[]
}): Promise<{ dataList?: UserCourse[], total?: number }> => {
  const { data, status } = await POST_API('get-course-members', args);
  if (status !== response_status_codes.success) return {};
  return data;
}

export const apiChangeCourseMemberStatus = async (args: { token: string; userId: string; courseId: string; status: number }): Promise<UserCourse | null> => {
  const { data, status } = await POST_API('change-course-member-status', args);
  if (status !== response_status_codes.success) return null;
  return data;
}
