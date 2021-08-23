import { getTimeZeroHour } from '..';
import { _Topic } from '../../custom-types';

export const canPlayTopic = (args: { topic: _Topic; isJoinedCourse: boolean }) => {
  return args.topic.startTime < getTimeZeroHour() && args.isJoinedCourse;
}

// export handleInvalidTopicPermission = (course)