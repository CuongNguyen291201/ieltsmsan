import { POST_API } from '../../sub_modules/common/api';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import { IUserActivity, UserActivity } from '../../sub_modules/share/model/userActivity';

export const apiGetUserActivitiesByCourse = async (args: { courseId: string }): Promise<UserActivity[]> => {
  const { data, status } = await POST_API('get-user-activities-by-course', args);
  if (status !== response_status_codes.success) return [];
  return data;
}

export const apiUpdateTimeActivity = async (args: IUserActivity): Promise<void> => {
  await POST_API('update-time-activity', args);
}
