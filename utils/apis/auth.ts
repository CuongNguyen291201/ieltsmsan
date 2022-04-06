import { POST_API } from '../../sub_modules/common/api'

export const apiLogout = () => POST_API('logout', {})

export const apiUpdateUserInfo = async (userInfo: any) => {
    const { data, status } = await POST_API('update-user-info-new', userInfo);
    if (status !== 200) return { success: false };
    return data;
}