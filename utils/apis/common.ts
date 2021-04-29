import { response_status, response_status_codes } from '../../sub_modules/share/api_services/http_status';

export async function fetchPaginationAPI<R>(args: {
  seekAPI: (args: { lastRecord?: R, [x: string]: any }) => Promise<{ data: any; status: number; message?: any }>;
  offsetAPI: (args: { skip?: number, [x: string]: any }) => Promise<{ data: any; status: number; message?: any }>;
  lastRecord?: R;
  skip?: number;
  [x: string]: any
}): Promise<{ total: number; data: R[] }> {
  const { seekAPI, offsetAPI } = args;
  const { data, status } = args.hasOwnProperty('skip')
    ? await offsetAPI(args)
    : await seekAPI(args);
  if (status !== response_status.success && status !== response_status_codes.success) {
    return { total: 0, data: [] };
  }
  return data;
}