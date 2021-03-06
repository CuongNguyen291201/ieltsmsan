import { getTimeZeroHour } from '..';
import { _Topic } from '../../custom-types';
import { STATUS_OPEN } from '../../sub_modules/share/constraint';

export const canPlayTopic = (args: { topic: _Topic; isJoinedCourse?: boolean }) => {
  return args.topic.status === STATUS_OPEN || args.isJoinedCourse;
}