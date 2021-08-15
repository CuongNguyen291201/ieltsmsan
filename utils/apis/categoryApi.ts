import { _Category } from '../../custom-types';
import { GET_API, POST_API, POST_REQ } from '../../sub_modules/common/api';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';

export const apiGetCategories = () => POST_REQ('get-root-categories', {});

export const apiGetTotalCourses = (categoryId: string) => POST_API('get-category-total-courses', { categoryId });

export const apiGetCategoriesByParent = (parentId: string | null) => POST_REQ('get-categories-by-parent', { parentId });

export const apiGetCategoryById = (categoryId: string) => POST_REQ('get-category-by-id', { categoryId });

export const apiGetCategoryBySlug = async (slug: string): Promise<_Category | null> => {
  const { data, status } = await GET_API(`get-category-by-slug?slug=${slug}`);
  if (status === response_status_codes.success) return data;
  return null;
};
