import { _Category } from '../../custom-types';
import { GET_API, POST_API, POST_REQ } from '../../sub_modules/common/api';
import { response_status, response_status_codes } from '../../sub_modules/share/api_services/http_status';
import { Category } from '../../sub_modules/share/model/category';

export const apiGetCategories = () => POST_REQ('get-root-categories', {});

export const apiGetTotalCourses = (categoryId: string) => POST_API('get-category-total-courses', { categoryId });

export const apiGetCategoriesByParent = async (parentId: string | null): Promise<_Category[]> => {
  const { data, status } = await POST_REQ('get-categories-by-parent', { parentId });
  if (status !== response_status.success) return null;
  return data;
}
export const apiGetCategoryById = async (categoryId: string): Promise<_Category | null> => {
  const { data, status } = await POST_REQ('get-category-by-id', { categoryId });
  if (status !== response_status.success) return null;
  return data;
};

export const apiGetCategoryBySlug = async (slug: string): Promise<_Category | null> => {
  const { data, status } = await GET_API(`get-category-by-slug?slug=${slug}`);
  if (status === response_status_codes.success) return data;
  return null;
};

export const apiGetAllCategoriesWithCourses = async (args?: { limitCourses?: number, position?: number }): Promise<_Category[]> => {
  const { data, status } = await POST_API('all-categories', args);
  if (status !== response_status_codes.success) return [];
  return (data as Category[]).sort((a, b) => a.index - b.index)
}
