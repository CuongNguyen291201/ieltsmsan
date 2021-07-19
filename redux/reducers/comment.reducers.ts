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
  };
}

const initialState: CommentState = {
  commentsList: [],
  mapReplies: {},
  isShowLoadMoreComments: false,
  mapShowLoadMoreReplies: {}
};

export function commentReducer(state = initialState, action: CommentAction): CommentState {
  if (action?.scope === Scopes.COMMENT) {
    switch (action.type) {
      case ActionTypes.LOAD_LIST:
        const list: Comment[] = action.payload.list;
        const mapRepliesNew = {};
        list.map((e) => {
          mapRepliesNew[e._id] = [];
        });
        return {
          ...state,
          commentsList: [...state.commentsList, ...list],
          mapReplies: { ...state.mapReplies, ...mapRepliesNew },
          isShowLoadMoreComments: !(list.length < (action.payload?.limit ?? 10))
        };

      case ActionTypes.CREATE_ONE:
        if (!action.payload.parentId) {
          if (!state.commentsList.find((e) => e._id === action.payload._id)) {
            const newList = [action.payload, ...state.commentsList];
            return {
              ...state,
              commentsList: newList,
              mapReplies: {
                ...state.mapReplies, [action.payload._id]: []
              }
            };
          } else {
            return state;
          }
        } else {
          const repliesList = state.mapReplies[action.payload.parentId] ?? [];
          if (!repliesList.find((e) => e._id === action.payload._id)) {
            state.commentsList.map((e) => {
              if (isEqualStringified(e._id, action.payload.parentId)) e.totalReplies = (e.totalReplies ?? 0) + 1;
            });
            return {
              ...state,
              mapReplies: {
                ...state.mapReplies, [action.payload.parentId]: [action.payload, ...repliesList]
              }
            };
          } else {
            return state;
          }
        }

      case ActionTypes.CMT_LOAD_REPLIES:
        const { parentId, replies } = action.payload;
        const currentReplies = state.mapReplies[parentId] ?? [];
        const newReplies = (replies as Discussion[]).filter((newReply) => !currentReplies.find((currentReply)  => currentReply._id === newReply._id));
        return {
          ...state,
          mapReplies: {
            ...state.mapReplies,
            [parentId]: [...currentReplies, ...newReplies]
          },
          mapShowLoadMoreReplies: {
            ...state.mapShowLoadMoreReplies,
            [parentId]: !(replies.length < (action.payload?.limit ?? 10))
          }
        };

      case ActionTypes.CMT_RESET_LIST:
        return {
          ...state,
          commentsList: [],
          mapReplies: {}
        };
    }
  }
  return state;
}
