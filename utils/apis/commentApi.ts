import { POST_API } from '../../sub_modules/common/api';
import Discussion, { IDiscussion } from '../../sub_modules/share/model/discussion';

export const apiCreateComment = (args: IDiscussion) => {
  return POST_API('create-comment', args);
}

export const apiSeekCommentsByCourse = (args: { courseId: string; limit?: number; lastRecord?: Discussion }) => {
  return POST_API('seek-comments-by-course', args);
}

export const apiSeekCommentsByTopic = (args: { topicId: string; limit?: number; lastRecord?: Discussion }) => {
  return POST_API('seek-comments-by-topic', args);
}

export const apiSeekDiscussionsByParent = (args: { parentId: string; limit?: number; lastRecord?: Discussion }) => {
  return POST_API('seek-discussions-by-parent', args);
}