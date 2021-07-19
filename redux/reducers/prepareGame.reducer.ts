import { GAME_STATUS_NONE, GAME_STATUS_PREPARE_REVIEW } from '../../sub_modules/game/src/gameConfig';
import { CARD_BOX_NONE } from '../../sub_modules/share/constraint';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import { PrepareGameAction } from '../actions/prepareGame.actions';
import { ActionTypes, Scopes } from '../types';

export interface PrepareGameState {
  status: number;
  statusGame: number;
  boxGame: number;
  studyScore: StudyScore | null;
}

const initialState: PrepareGameState = {
  status: -1,
  statusGame: GAME_STATUS_NONE,
  boxGame: CARD_BOX_NONE,
  studyScore: null
}

export function prepareGameReducer(state = initialState, action: PrepareGameAction): PrepareGameState {
  if (action?.scope === Scopes.PREPARE_GAME) {
    switch(action.type) {
      case ActionTypes.PRE_GAME_REVIEW_BOX:
        return {
          ...state, boxGame: action.payload, statusGame: GAME_STATUS_PREPARE_REVIEW
        }

      case ActionTypes.PRE_REVIEW_GAME:
      case ActionTypes.PRE_RESUME_GAME:
      case ActionTypes.PRE_PLAY_GAME:
      case ActionTypes.PRE_GO_TO_GAME:
        return {
          ...state,
          statusGame: action.payload.statusGame,
          studyScore: action.payload.studyScore,
          boxGame: action.payload.boxGame ?? CARD_BOX_NONE
        }

      default:
        return state;
    }
  }
  return state;
}