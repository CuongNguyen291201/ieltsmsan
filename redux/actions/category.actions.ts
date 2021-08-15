import { BaseAction } from '.';
import { _Category } from '../../custom-types';
import { ActionTypes, Scopes } from '../types';

export interface CategoryAction extends BaseAction {
  scope: typeof Scopes.CATEGORY
}

export const setCurrentCategoryAction = (category: _Category): CategoryAction => ({
  scope: Scopes.CATEGORY, type: ActionTypes.CT_SET_CURENTT_CATEGORY, payload: { category }
});