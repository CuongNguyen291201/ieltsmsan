import { BaseAction } from '.';
import Discussion from '../../sub_modules/share/model/discussion';
import { UserInfo } from '../../sub_modules/share/model/user';
import { ActionTypes, Scopes } from '../types';

export interface CommentAction extends BaseAction {
  scope: typeof Scopes.COMMENT
}

export const fetchCourseCommentsAction = (args: { courseId: string; lastRecord?: Discussion }): CommentAction => ({
  scope: Scopes.COMMENT, type: ActionTypes.CMT_FETCH_COURSE_COMMENTS, payload: args
});

export const fetchTopicCommentsAction = (args: { topicId: string; lastRecord?: Discussion }): CommentAction => ({
  scope: Scopes.COMMENT, type: ActionTypes.CMT_FETCH_TOPIC_COMMENTS, payload: args
});

export const fetchRepliesAction = (args: { parentId: string; lastRecord?: Discussion }): CommentAction => ({
  scope: Scopes.COMMENT, type: ActionTypes.CMT_FETCH_REPLIES, payload: args
});

export const createCommentAction = (args: { comment: Discussion; user: UserInfo }): CommentAction => ({
  scope: Scopes.COMMENT, type: ActionTypes.CMT_CREATE_COMMENT, payload: args
});

export const loadRepliesAction = (args: { parentId: string; replies: Array<Discussion> }): CommentAction => ({
  scope: Scopes.COMMENT, type: ActionTypes.CMT_LOAD_REPLIES, payload: args
});

export const resetCommentStateAction = (): CommentAction => ({
  scope: Scopes.COMMENT, type: ActionTypes.CMT_RESET_LIST
})
