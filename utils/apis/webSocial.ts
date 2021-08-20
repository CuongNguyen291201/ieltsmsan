import { GET_API } from "../../sub_modules/common/api"
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import WebSocial from '../../sub_modules/share/model/webSocial';

export const apiWebSocial = async () => {
  const { data, status } = await GET_API('/get-all-web-socials', 'api-cms');
  if (status !== response_status_codes.success) return null;
  return Array.isArray(data) ? (data as WebSocial[])[0] : null;
}
