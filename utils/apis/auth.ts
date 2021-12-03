import { POST_API } from '../../sub_modules/common/api';

export const apiLogout = (endpoint?: string) => POST_API(`${endpoint || process.env.NEXT_PUBLIC_NEXT_ENDPOINT}/api/auth/logout`, {});