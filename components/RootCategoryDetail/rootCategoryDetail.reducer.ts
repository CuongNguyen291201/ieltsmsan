import { type } from 'os';
import { Course } from '../../sub_modules/share/model/courses';

// Action Types
export enum ActionTypes {
  INIT_MAP_COURSES,
  INIT_MAP_PAGE_DATA,
  SET_MAP_COURSES_KEY,
  SET_MAP_PAGE_DATA_KEY_CURRENT_PAGE
}

export type MapCategoryCourses = {
  [categoryId: string]: Course[]
}
export type MapCategoryPageData = {
  [categoryId: string]: {
    currentPage: number;
    totalPages: number;
  }
}

interface CategoryDetailAction {
  type: ActionTypes;
  mapCategoryCourses?: MapCategoryCourses;
  mapCategoryPageData?: MapCategoryPageData;
  categoryId?: string;
  currentPage?: number;
  courses?: Course[];
  totalPages?: number;
}

// States

export type CategoryDetailState = {
  mapCategoryCourses: MapCategoryCourses;
  mapCategoryPageData: MapCategoryPageData;
}

export const categoryDetailInitState: CategoryDetailState = {
  mapCategoryCourses: {},
  mapCategoryPageData: {}
}

// Reducers

export function categoryDetailReducer(state: CategoryDetailState = categoryDetailInitState, action: CategoryDetailAction): CategoryDetailState {
  switch (action.type) {
    case ActionTypes.INIT_MAP_COURSES:
      return {
        ...state,
        mapCategoryCourses: action.mapCategoryCourses!
      }

    case ActionTypes.INIT_MAP_PAGE_DATA:
      return {
        ...state,
        mapCategoryPageData: action.mapCategoryPageData!
      }

    case ActionTypes.SET_MAP_COURSES_KEY:
      return {
        ...state,
        mapCategoryCourses: {
          ...state.mapCategoryCourses,
          [action.categoryId!]: action.courses!
        }
      }

    case ActionTypes.SET_MAP_PAGE_DATA_KEY_CURRENT_PAGE:
      return {
        ...state,
        mapCategoryPageData: {
          ...state.mapCategoryPageData,
          [action.categoryId!]: {
            ...state.mapCategoryPageData[action.categoryId!],
            currentPage: action.currentPage!
          }
        }
      }

    default:
      return state;
  }
}

// Action Creators & logic

export const initMapCourses = (mapCategoryCourses: MapCategoryCourses): CategoryDetailAction => ({
  type: ActionTypes.INIT_MAP_COURSES,
  mapCategoryCourses
});

export const initMapPageData = (mapCategoryPageData: MapCategoryPageData): CategoryDetailAction => ({
  type: ActionTypes.INIT_MAP_PAGE_DATA,
  mapCategoryPageData
});

export const setMapCoursesKey = (categoryId: string, courses: Course[]): CategoryDetailAction => ({
  type: ActionTypes.SET_MAP_COURSES_KEY,
  categoryId, courses
});

export const setMapPageDataKeyCurrentPage = (categoryId: string, currentPage: number): CategoryDetailAction => ({
  type: ActionTypes.SET_MAP_PAGE_DATA_KEY_CURRENT_PAGE,
  categoryId, currentPage
})
