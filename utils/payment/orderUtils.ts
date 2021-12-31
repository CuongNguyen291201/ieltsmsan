import { showToastifySuccess, showToastifyWarning } from "../../sub_modules/common/utils/toastify";

export const ORDER_RETURN_KEY = 'orderReturnUrl';
export const CART_ITEMS_KEY = 'courseIds';
export const COUPON_CODE_KEY = '_hvvv_data_coupon_code';
export const COUPON_CODE_ENCODE_KEY = 'PXXhEqEDZ8svm3e7tLilW60kl1VTy42J';

export default {
  addCourseToCart: (courseId: string, callback?: () => void) => {
    const cartItems = localStorage.getItem(CART_ITEMS_KEY) ? localStorage.getItem(CART_ITEMS_KEY).split(',') : [];
    if (!!courseId && !cartItems.find((id) => id === courseId)) {
      if (callback) callback();
      cartItems.push(courseId);
      localStorage.setItem(CART_ITEMS_KEY, cartItems.join());
      showToastifySuccess('Đã thêm vào giỏ hàng');
    } else {
      showToastifyWarning('Khoá học đã có trong giỏ hàng');
    }
  },

  removeCourseFromCart: (courseId: string, callback?: () => void) => {
    const cartItems = localStorage.getItem(CART_ITEMS_KEY) ? localStorage.getItem(CART_ITEMS_KEY).split(',') : [];
    if (!!courseId && !!cartItems.length) {
      if (callback) callback();
      localStorage.setItem(CART_ITEMS_KEY, cartItems.filter((id) => id !== courseId).join())
    }
  },

  clearCart: () => {
    localStorage.removeItem(CART_ITEMS_KEY);
  },

  getCartItemsStorage: () => {
    return localStorage.getItem(CART_ITEMS_KEY) ? localStorage.getItem(CART_ITEMS_KEY).split(',') : [];
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