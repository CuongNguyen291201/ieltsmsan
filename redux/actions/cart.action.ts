import { BaseAction } from '.';
import { Scopes } from '../types';

export interface CartAction extends BaseAction {
  scope: typeof Scopes.CART
}