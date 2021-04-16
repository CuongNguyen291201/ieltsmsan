import { POST_API } from "../sub_modules/common/api"

export const getCategoriesByParentIdApi = (parentId) => {
  return POST_API('get-categories-by-parent-id', { parentId })
}