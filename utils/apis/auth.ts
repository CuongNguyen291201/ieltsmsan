import { POST_API } from '../../sub_modules/common/api'

export const apiLogout = (args: { token: string }) => POST_API('logout', args)