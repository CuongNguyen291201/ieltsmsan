import { POST_API } from '../../sub_modules/common/api';

export const apiGetCategories = (args?: { withTotalCourses?: boolean }) => POST_API('get-categories', args);

export const apiGetTotalCourses = (categoryId: string) => POST_API('get-category-total-courses', { categoryId });