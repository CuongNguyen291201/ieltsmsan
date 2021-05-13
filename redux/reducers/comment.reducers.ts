import Discussion from '../../sub_modules/share/model/discussion';
import { CommentAction } from '../actions/comment.action';
import { ActionTypes, Scopes } from '../types';

export interface CommentState {
  commentsList: Array<Discussion>;
  mapReplies: {
    [x: string]: Array<Discussion>;
  }
}

const initialState: CommentState = {
  commentsList: [],
  mapReplies: {}
}

export function commentReducer(state = initialState, action: CommentAction): CommentState {
  if (action?.scope === Scopes.COMMENT) {
    switch (action.type) {
      case ActionTypes.LOAD_LIST:
        const list: Discussion[] = action.payload;
        const mapReplies = {};
        list.map((e) => {
          mapReplies[e._id] = []
        });
        return {
          ...state,
          commentsList: [...state.commentsList, ...list],
          mapReplies
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
