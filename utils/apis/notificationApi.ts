import { POST_API } from '../../sub_modules/common/api';
import { Notification } from '../../sub_modules/share/model/notification';

export const apiListNotificationByTarget = (args: { target: string, offset: number }) => {
  return POST_API('get-notification-by-type', args);
}

export const apiListNotificationByReadStatus = (args: { target: string, offset: number }) => {
  return POST_API('get-notification-by-read-status', args);
}

export const apiDiscussionsById = (args: { _id: string }) => {
  return POST_API('get-discussions-by-id', args);
}

export const apiUpdateReadStatusNotification = (args: { notificationId: string }) => {
  return POST_API('put-read-status-notification', args);
}