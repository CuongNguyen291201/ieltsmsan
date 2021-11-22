import { GET_API } from "../../sub_modules/common/api";
import { response_status_codes } from "../../sub_modules/share/api_services/http_status";
import Skill from "../../sub_modules/share/model/skill";

export const apiGetListSkills = async (args: { parentId?: string; examType?: number }): Promise<Skill[]> => {
  const { parentId, examType } = args;
  const params = {};
  if (typeof parentId !== 'undefined') Object.assign(params, { parentId });
  if (typeof examType !== 'undefined') Object.assign(params, { examType });
  const url = `/skills?${new URLSearchParams(params).toString()}`;
  const { data, status } = await GET_API(url, 'api');
  if (status !== response_status_codes.success) return [];
  return data;
}