import {
  CODE_ACTIVED,
  CODE_ACTIVE_OUT_OF_DATE,
  CODE_EXPIRED,
  CODE_NOT_MATCH,
  CODE_NOT_YET_TIME,

  PAYMENT_BANK,
  PAYMENT_COD,
  PAYMENT_GIF,
  PAYMENT_MOMO,
  PAYMENT_PAYPAL,
  PAYMENT_VISA,
  PAYMENT_VNPAY,

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

export const MapPaymentType = {
  [PAYMENT_BANK]: 'Chuyển khoản ngân hàng',
  [PAYMENT_COD]: 'Thanh toán khi nhận hàng trực tiếp',
  [PAYMENT_GIF]: 'GIF',
  [PAYMENT_MOMO]: 'Thanh toán qua ví MoMo',
  [PAYMENT_PAYPAL]: 'Thanh toán qua Paypal',
  [PAYMENT_VISA]: 'Thanh toán qua Visa',
  [PAYMENT_VNPAY]: 'Thanh toán qua ví VNPAY'
}