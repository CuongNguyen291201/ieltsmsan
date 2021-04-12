import { DemoAction } from '../actions/demo.actions';
import { ActionTypes, Scopes } from '../types';

export interface DemoState {
  value: number;
}

const initialState: DemoState = {
  value: 0
}

export function demoReducer(state = initialState, action: DemoAction): DemoState {
  if (action?.scope === Scopes.DEMO) {
    switch (action.type) {
      case ActionTypes.SUCCESS:
        return {
          ...state,
          value: action.payload
        }
      case ActionTypes.DEMO_INCREMENT:
        return { ...state, value: state.value + 1 }

      case ActionTypes.DEMO_DECREMENT:
        return { ...state, value: state.value - 1 }

      default:
        return state;
    }
  }
  return state;
}
