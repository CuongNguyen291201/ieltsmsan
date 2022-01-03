import { getEndpoint } from ".";
import PageLayout from "../../custom-types/PageLayout";
import { POST_API } from "../../sub_modules/common/api";
import { response_status_codes } from "../../sub_modules/share/api_services/http_status";

export const apiGetPageLayout = async (args: {
  slug?: string;
  menu?: boolean;
  serverSide?: boolean;
} = { serverSide: true }): Promise<PageLayout> => {
  const { serverSide, ...reqBody } = args;
  const { data, status } = await POST_API(getEndpoint('api/get-page-layout', serverSide), reqBody);
  if (status !== response_status_codes.success) return {
    webInfo: null, webSeo: null, webSocial: null, webMenuItems: []
  }
  return data;
}