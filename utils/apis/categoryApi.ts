import { POST_API, POST_REQ } from '../../sub_modules/common/api';

export const apiGetCategories = () => POST_REQ('get-root-categories', {});

export const apiGetTotalCourses = (categoryId: string) => POST_API('get-category-total-courses', { categoryId });

export const apiGetCategoriesByParent = (parentId: string | null) => POST_REQ('get-categories-by-parent', { parentId });

export const apiGetCategoryById = (categoryId: string) => POST_REQ('get-category-by-id', { categoryId })
