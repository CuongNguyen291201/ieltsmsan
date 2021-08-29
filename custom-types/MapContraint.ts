import {
  CODE_ACTIVED,
  CODE_ACTIVE_OUT_OF_DATE,
  CODE_EXPIRED,
  CODE_NOT_MATCH,
  CODE_NOT_YET_TIME,

  USER_COURSE_APPROVE,
  USER_COURSE_REJECT,
  USER_COURSE_WAITING
} from '../sub_modules/share/constraint';

export const MapUserCourseStatus = {
  [USER_COURSE_APPROVE]: 'Đã tham gia',
  [USER_COURSE_WAITING]: 'Đang chờ phê duyệt',
  [USER_COURSE_REJECT]: 'Bị từ chối'
}

export const MapActiveCourseErrorStatus = {
  [CODE_ACTIVED]: 'Mã kích hoạt đã sử dụng',
  [CODE_EXPIRED]: 'Mã kích hoạt đã hết hạn',
  [CODE_ACTIVE_OUT_OF_DATE]: 'Mã kích hoạt không khả dụng',
  [CODE_NOT_MATCH]: 'Mã kích hoạt không chính xác',
  [CODE_NOT_YET_TIME]: 'Mã kích hoạt chưa khả dụng'
}