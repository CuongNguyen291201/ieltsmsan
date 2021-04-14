import { HomeCategory } from '../../custom-types';
import { CategoryAction } from '../actions/category.actions';
import { ActionTypes, Scopes } from '../types';

export interface CategoryState {
  homeCategories: Array<HomeCategory>
}

const initialState: CategoryState = {
  homeCategories: []
}

export function categoryReducer(state = initialState, action: CategoryAction): CategoryState {
  if (action?.scope === Scopes.CATEGORY) {
    switch (action.type) {
      case ActionTypes.LOAD_LIST:
        return {
          ...state,
          [action.target ?? 'homeCategory']: action.payload
        }

      default:
        return state;
    }
  }
  return state;
}