import { GET_API, POST_API } from "../../sub_modules/common/api"
import { response_status_codes } from '../../sub_modules/share/api_services/http_status'
import CategoryNews from '../../sub_modules/share/model/categoryNews'
import News, { INews } from "../../sub_modules/share/model/news"


export const apiNewsCategories = (limit: number = 0): Promise<{
    data: { categories: CategoryNews[]; mapCategoryNews?: { [categoryId: string]: News[] } };
    status: number;
}> => GET_API(`news-categories?limitNews=${limit}`)
export const apiGetNewsBySlug = (args: {
    newsSlug: any
}) => POST_API('/get-news-by-slug', args)
export const offsetNewsByCategory = (args: {
    field?: keyof INews,
    skip?: number,
    limit?: number,
    asc?: boolean,
    categoryId: string

}) => POST_API('/offset-news-by-category', args)
export const apiBreakingNews = () => GET_API('/get-latest-news')
export const apiFullNews = async (args: {
    limit?: number;
    skip?: number;
}): Promise<{ data: News[]; total: number }> => {
    const { data, status } = await POST_API('offset-latest-news', args);
    if (status !== response_status_codes.success) return { data: [], total: 0 };
    return data;
}

export const apiGetNewsById = async (id: string): Promise<News> => {
    const { data, status } = await GET_API(`news/${id}`);
    if (status !== response_status_codes.success) return null;
    return data;
}

export const apiGetNewsByCategorySlug = async (args: {
    newsCategorySlug: string;
    limit: number;
    offset: number;
}): Promise<{
    data: News[];
    total: number
}> => {
    const { data, status } = await POST_API('get-news-by-category-slug', args);
    if (status !== response_status_codes.success) return {
        data: [], total: 0
    };
    return {
        data: data.theNewsList, total: data.totalNews
    };
}