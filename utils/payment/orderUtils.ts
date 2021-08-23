import { message } from 'antd';

export const ORDER_RETURN_KEY = 'orderReturnUrl';

export default {
  addCourseToOrder: (courseId: string, callback?: () => void) => {
    const currentCourseIds = localStorage.getItem('courseIds') ? localStorage.getItem('courseIds').split(',') : [];
    if (!!courseId && !currentCourseIds.find((id) => id === courseId)) {
      if (callback) callback();
      currentCourseIds.push(courseId);
      localStorage.setItem('courseIds', currentCourseIds.join());
      message.success('Đã thêm vào giỏ hàng');
    } else {
      message.warning('Khoá học đã có trong giỏ hàng');
    }
  },

  setReturnUrl: (path: string) => {
    localStorage.setItem(ORDER_RETURN_KEY, path);
  },

  getReturnUrl: () => {
    return localStorage.getItem(ORDER_RETURN_KEY);
  },

  clearReturnUrl: () => {
    localStorage.removeItem(ORDER_RETURN_KEY);
  }
}