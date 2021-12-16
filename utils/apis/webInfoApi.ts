import { getEndpoint } from ".";
import { POST_API } from '../../sub_modules/common/api'
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSeo from '../../sub_modules/share/model/webSeo';

export const apiWebInfo = async (args: { pageSlug?: string; serverSide?: boolean } = {}): Promise<{
  webInfo?: WebInfo; webSeo?: WebSeo;
}> => {
  const { data, status } = await POST_API(getEndpoint('api/get-web-info', args.serverSide), args);
  if (status !== response_status_codes.success) return {};
  return {
    webInfo: data?.theWebInfo || null,
    webSeo: data?.theWebSeoBySlug || null
  }
}