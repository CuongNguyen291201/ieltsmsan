import { POST_API, POST_REQ } from '../../sub_modules/common/api';

export const apiGetCategories = () => POST_REQ('get-root-categories', {});

export const apiGetTotalCourses = (categoryId: string) => POST_API('get-category-total-courses', { categoryId });