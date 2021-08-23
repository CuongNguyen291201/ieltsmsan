import { CartAction } from '../actions/cart.action';
import { ActionTypes, Scopes } from '../types';

export interface CartState {
  items: string[];
  isLoading: boolean;
}

const initialState: CartState = {
  items: [],
  isLoading: true
}

export function cartReducer(state: CartState = initialState, action: CartAction): CartState {
  if (action?.scope === Scopes.CART) {
    switch(action.type) {
      case ActionTypes.LOAD_LIST:
        return {
          ...state,
          items: action.payload,
          isLoading: false
        }

      case ActionTypes.CREATE_ONE:
        return {
          ...state,
          items: [...state.items, action.payload]
        }
      case ActionTypes.REMOVE_ONE:
        return {
          ...state,
          items: state.items.filter((courseId) => courseId !== action.payload)
        }
    }
  }
  return state;
}