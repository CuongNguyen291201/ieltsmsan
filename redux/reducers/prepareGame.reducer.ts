import { GAME_STATUS_NONE } from '../../sub_modules/game/src/gameConfig';
import { CARD_BOX_NONE } from '../../sub_modules/share/constraint';
import { PrepareGameAction } from '../actions/prepareGame.actions';
import { ActionTypes, Scopes } from '../types';

export interface PrepareGameState {
  status: number;
  statusGame: number;
  boxGame: number;
}

const initialState: PrepareGameState = {
  status: -1,
  statusGame: GAME_STATUS_NONE,
  boxGame: CARD_BOX_NONE
}

export function prepareGameReducer(state = initialState, action: PrepareGameAction): PrepareGameState {
  if (action?.scope === Scopes.PREPARE_GAME) {
    switch(action.type) {
      case ActionTypes.PRE_GAME_REVIEW_BOX:
        return {
          ...state, boxGame: action.payload
        }

      case ActionTypes.PRE_REVIEW_GAME:
      case ActionTypes.PRE_RESUME_GAME:
        return {
          ...state, statusGame: action.payload
        }

      default:
        return state;
    }
  }
  return state;
}