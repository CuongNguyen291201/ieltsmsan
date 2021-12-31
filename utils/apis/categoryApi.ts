import { getEndpoint } from ".";
import { _Category } from '../../custom-types';
import { GET_API, POST_API, POST_REQ } from '../../sub_modules/common/api';
import { response_status, response_status_codes } from '../../sub_modules/share/api_services/http_status';
import { Category } from '../../sub_modules/share/model/category';

export const apiGetCategories = (serverSide?: boolean) => POST_REQ(getEndpoint('api/get-root-categories', serverSide), {});

export const apiGetTotalCourses = (categoryId: string) => POST_API('get-category-total-courses', { categoryId });

export const apiGetCategoriesByParent = async (args: { parentId: string | null; serverSide?: boolean }): Promise<_Category[]> => {
  const { data, status } = await POST_REQ(getEndpoint('api/get-categories-by-parent', args.serverSide), { parentId: args.parentId });
  if (status !== response_status.success) return null;
  return data;
}
export const apiGetCategoryById = async (args: { categoryId: string, serverSide?: boolean }): Promise<_Category | null> => {
  const { data, status } = await POST_REQ(getEndpoint('api/get-category-by-id', args.serverSide), { categoryId: args.categoryId });
  if (status !== response_status.success) return null;
  return data;
};

export const apiGetCategoryBySlug = async (slug: string): Promise<_Category | null> => {
  const { data, status } = await GET_API(`get-category-by-slug?slug=${slug}`);
  if (status === response_status_codes.success) return data;
  return null;
};

export const apiGetAllCategoriesWithCourses = async (args?: { limitCourses?: number; parentId?: string; position?: number; serverSide?: boolean; slugs?: string[] }): Promise<_Category[]> => {
  const { serverSide, ...reqBody } = args;
  const { data, status } = await POST_API(getEndpoint('api/all-categories', serverSide), reqBody);
  if (status !== response_status_codes.success) return [];
  return (data as Category[]).sort((a, b) => a.index - b.index)
}
