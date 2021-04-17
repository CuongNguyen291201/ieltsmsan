import { OtsvCategory } from '../../custom-types';
import { CategoryAction } from '../actions/category.actions';
import { ActionTypes, Scopes } from '../types';

export interface CategoryState {
  homeCategories: Array<OtsvCategory>
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
          [action.target ?? 'homeCategories']: action.payload
        }

      default:
        return state;
    }
  }
  return state;
}