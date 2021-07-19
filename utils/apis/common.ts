import { response_status, response_status_codes } from '../../sub_modules/share/api_services/http_status';

export async function fetchPaginationAPI<R>(args: {
  seekAPI: (args: { lastRecord?: R, [x: string]: any }) => Promise<{ data: any; status: number; message?: any }>;
  offsetAPI: (args: { skip?: number, [x: string]: any }) => Promise<{ data: any; status: number; message?: any }>;
  lastRecord?: R;
  skip?: number;
  [x: string]: any
}): Promise<R[]> {
  const { seekAPI, offsetAPI, ...reqBody } = args;
  const { data, status } = args.hasOwnProperty('skip')
    ? await offsetAPI(reqBody)
    : await seekAPI(reqBody);
  if (status !== response_status.success && status !== response_status_codes.success) {
    return [];
  }
  return data;
}
