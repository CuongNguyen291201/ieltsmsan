import { getEndpoint } from "."
import { GET_API, POST_API } from "../../sub_modules/common/api"
import { response_status_codes } from '../../sub_modules/share/api_services/http_status'
import CategoryNews from '../../sub_modules/share/model/categoryNews'
import News, { INews } from "../../sub_modules/share/model/news"


export const apiNewsCategories = (args: { limit?: number, serverSide?: boolean }): Promise<{
    data: { categories: CategoryNews[]; mapCategoryNews?: { [categoryId: string]: News[] } };
    status: number;
}> => {
    const { limit = 0, serverSide } = args;
    return GET_API(getEndpoint(`api/news-categories?limitNews=${limit}`, serverSide))
}
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
    serverSide?: boolean;
}): Promise<{ data: News[]; total: number }> => {
    const { data, status } = await POST_API(getEndpoint('api/offset-latest-news', args.serverSide), args);
    if (status !== response_status_codes.success) return { data: [], total: 0 };
    return data;
}

export const apiGetNewsById = async (id: string, serverSide?: boolean): Promise<News> => {
    const { data, status } = await GET_API(getEndpoint(`api/news/${id}`, serverSide));
    if (status !== response_status_codes.success) return null;
    return data;
}

export const apiGetNewsByCategorySlug = async (args: {
    newsCategorySlug: string;
    limit: number;
    offset: number;
    serverSide?: boolean;
}): Promise<{
    data: News[];
    total: number
}> => {
    const { data, status } = await POST_API(getEndpoint('api/get-news-by-category-slug', args.serverSide), args);
    if (status !== response_status_codes.success) return {
        data: [], total: 0
    };
    return {
        data: data.theNewsList, total: data.totalNews
    };
}