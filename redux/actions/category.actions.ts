import { BaseAction } from '.';
import { Scopes } from '../types';

export interface CategoryAction extends BaseAction {
  scope: typeof Scopes.CATEGORY
}
