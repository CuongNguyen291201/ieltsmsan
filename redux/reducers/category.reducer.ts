import { _Category } from '../../custom-types';
import { CategoryAction } from '../actions/category.actions';
import { ActionTypes, Scopes } from '../types';

export interface CategoryState {
  homeCategories: Array<_Category>;
  currentCategory: _Category;
}

const initialState: CategoryState = {
  homeCategories: [],
  currentCategory: null
}

export function categoryReducer(state = initialState, action: CategoryAction): CategoryState {
  if (action?.scope === Scopes.CATEGORY) {
    switch (action.type) {
      case ActionTypes.LOAD_LIST:
        return {
          ...state,
          [action.target ?? 'homeCategories']: action.payload
        }

      case ActionTypes.CT_SET_CURENTT_CATEGORY:
        return {
          ...state,
          currentCategory: action.payload.category
        }

      default:
        return state;
    }
  }
  return state;
}