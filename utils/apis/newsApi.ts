import { GET_API, POST_API } from "../../sub_modules/common/api"
import { INews } from "../../sub_modules/share/model/news"


export const apiNewsCategories = (limit: number = 0) => GET_API(`news-categories?limitNews=${limit}`)
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
export const apiBreakingNews = ()=>GET_API('/get-latest-news')