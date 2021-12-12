import { WebMenuItem } from '../../sub_modules/share/model/webMenuItem';
import { GET_API } from './../../sub_modules/common/api';

export const webMenuApi = async (): Promise<WebMenuItem[]> => {
    const { status, data } = await GET_API("api-cms/web-menu-items");
    if (status === 200) {
        return data as WebMenuItem[];
    }
    return [];
}