import { Comment } from '../../custom-types';
import Discussion from '../../sub_modules/share/model/discussion';
import { isEqualStringified } from '../../utils';
import { CommentAction } from '../actions/comment.action';
import { ActionTypes, Scopes } from '../types';

export interface CommentState {
  commentsList: Array<Comment>;
  mapReplies: {
    [x: string]: Array<Discussion>;
  };
  isShowLoadMoreComments: boolean;
  mapShowLoadMoreReplies: {
    [x: string]: boolean;
  }
}

const initialState: CommentState = {
  commentsList: [],
  mapReplies: {},
  isShowLoadMoreComments: false,
  mapShowLoadMoreReplies: {}
}

export function commentReducer(state = initialState, action: CommentAction): CommentState {
  if (action?.scope === Scopes.COMMENT) {
    switch (action.type) {
      case ActionTypes.LOAD_LIST:
        const list: Comment[] = action.payload;
        const mapRepliesNew = {};
        list.map((e) => {
          mapRepliesNew[e._id] = []
        });
        return {
          ...state,
          commentsList: [...state.commentsList, ...list],
          mapReplies: { ...state.mapReplies, ...mapRepliesNew },
          isShowLoadMoreComments: !!list.length
        }

      case ActionTypes.CREATE_ONE:
        if (!action.payload.parentId) {
          const newList = [action.payload, ...state.commentsList];
          return {
            ...state,
            commentsList: newList,
            mapReplies: {
              ...state.mapReplies, [action.payload._id]: []
            }
          }
        } else {
          const repliesList = state.mapReplies[action.payload.parentId] ?? [];
          state.commentsList.map((e) => {
            if (isEqualStringified(e._id, action.payload.parentId)) e.totalReplies += 1;
          });
          return {
            ...state,
            mapReplies: {
              ...state.mapReplies, [action.payload.parentId]: [action.payload, ...repliesList]
            }
          }
        }

      case ActionTypes.CMT_LOAD_REPLIES:
        const { parentId, replies } = action.payload;
        const currentReplies = state.mapReplies[parentId] ?? [];
        return {
          ...state,
          mapReplies: {
            ...state.mapReplies,
            [parentId]: [...currentReplies, ...replies]
          },
          mapShowLoadMoreReplies: {
            ...state.mapShowLoadMoreReplies,
            [parentId]: !!replies.length
          }
        }

      case ActionTypes.CMT_RESET_LIST:
        return {
          ...state,
          commentsList: [],
          mapReplies: {}
        }
    }
  }
  return state;
}
