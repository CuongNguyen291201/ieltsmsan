import { USER_COURSE_APPROVE, USER_COURSE_REJECT } from '../../../sub_modules/share/constraint';
import { UserInfo } from '../../../sub_modules/share/model/user';
import UserCourse from '../../../sub_modules/share/model/userCourse';

// Action Types
enum ActionTypes {
  CHANGE_PAGE = 'CHANGE_PAGE',
  SET_LOADING = 'SET_LOADING',
  INIT_MEM_LIST = 'INIT_MEM_LIST',
  SET_ON_ACTION = 'SET_ON_ACTION',
  SET_NEW_MEM_STATUS = 'SET_NEW_MEM_STATUS',
  SET_USER_STAT = 'SET_USER_STAT'
}

interface MemListAction {
  type: ActionTypes,
  memLists?: UserCourse[];
  currentPage?: number;
  totalMems?: number;
  isLoading?: boolean;
  isOnAction?: boolean;
  userCourse?: UserCourse;
  userStat?: UserInfo;
}

// States

type MemListState = {
  memLists: UserCourse[];
  currentPage: number;
  totalMems: number;
  isLoading: boolean;
  isOnAction: boolean;
  userStat: UserInfo | null;
}

export const memListInitState: MemListState = {
  memLists: [],
  currentPage: 1,
  totalMems: 0,
  isLoading: true,
  isOnAction: false,
  userStat: null
}

// Reducers

export function memListReducer(state: MemListState = memListInitState, action: MemListAction): MemListState {
  switch (action.type) {
    case ActionTypes.CHANGE_PAGE:
      return { ...state, currentPage: action.currentPage, memLists: action.memLists, totalMems: action.totalMems }

    case ActionTypes.INIT_MEM_LIST:
      return { ...state, memLists: action.memLists, totalMems: action.totalMems, currentPage: 1 }

    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.isLoading }

    case ActionTypes.SET_ON_ACTION:
      return { ...state, isLoading: action.isOnAction }

    case ActionTypes.SET_NEW_MEM_STATUS:
      const idx = state.memLists.findIndex((uc) => uc._id === action.userCourse?._id);
      if (idx === -1) return state;
      const newLists = state.memLists;
      newLists.splice(idx, 1, action.userCourse);
      return {
        ...state,
        memLists: [...newLists]
      }

    case ActionTypes.SET_USER_STAT:
      return {
        ...state, userStat: action.userStat || null
      }

    default:
      return state;
  }
}

// Action Creators

export const setLoading = (isLoading: boolean): MemListAction => ({
  type: ActionTypes.SET_LOADING, isLoading
});

export const changePage = (args: { currentPage: number, memLists: UserCourse[], totalMems: number }): MemListAction => ({
  type: ActionTypes.CHANGE_PAGE, ...args
});

export const initMemList = (args: { memLists: UserCourse[], totalMems: number }): MemListAction => ({
  type: ActionTypes.INIT_MEM_LIST, ...args
});

export const setOnAction = (isOnAction: boolean): MemListAction => ({
  type: ActionTypes.SET_LOADING, isOnAction
});

export const setNewMemListStatus = (userCourse: UserCourse): MemListAction => ({
  type: ActionTypes.SET_NEW_MEM_STATUS, userCourse
});

export const setUserStat = (userStat: UserInfo): MemListAction => ({
  type: ActionTypes.SET_USER_STAT, userStat
});
