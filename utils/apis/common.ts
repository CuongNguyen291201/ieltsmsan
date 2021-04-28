import { response_status, response_status_codes } from '../../sub_modules/share/api_services/http_status';

export async function fetchPaginationAPI<R, F = {}>(args: {
  seekAPI: (args: { lastRecord?: R } & any) => Promise<{ data: any; status: number; messaeg?: any }>;
  offsetAPI: (args: { skip?: number } & any) => Promise<{ data: any; status: number; messaeg?: any }>;
  lastRecord?: R;
  skip?: number;
} & F): Promise<{ total: number; data: R[] }> {
  const { seekAPI, offsetAPI } = args;
  const { data, status } = args.hasOwnProperty('skip')
    ? await offsetAPI(args)
    : await seekAPI(args);
  if (status !== response_status.success && status !== response_status_codes.success) {
    return { total: 0, data: [] };
  }
  return data;
}