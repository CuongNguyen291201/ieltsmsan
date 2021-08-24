import { USER_COURSE_APPROVE, USER_COURSE_REJECT, USER_COURSE_WAITING } from '../sub_modules/share/constraint';

export const MapUserCourseStatus = {
  [USER_COURSE_APPROVE]: 'Đã tham gia',
  [USER_COURSE_WAITING]: 'Đang chờ phê duyệt',
  [USER_COURSE_REJECT]: 'Bị từ chối'
}