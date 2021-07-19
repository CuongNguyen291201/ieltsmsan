import { BaseAction } from '.';
import { GAME_STATUS_PREPARE_CONTINUE, GAME_STATUS_PREPARE_REVIEW, GAME_STATUS_REVIEW_BOX } from '../../sub_modules/game/src/gameConfig';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import { ActionTypes, Scopes } from '../types';

export interface PrepareGameAction extends BaseAction {
  scope: typeof Scopes.PREPARE_GAME;
}

export const prepareGameReviewBoxAction = (box: number): PrepareGameAction => ({
  scope: Scopes.PREPARE_GAME, type: ActionTypes.PRE_GAME_REVIEW_BOX, payload: box
});

export const prepareReviewGameAction = (): PrepareGameAction => ({
  scope: Scopes.PREPARE_GAME, type: ActionTypes.PRE_REVIEW_GAME, payload: GAME_STATUS_PREPARE_REVIEW
});

export const prepareReviewGameBoxAction = (): PrepareGameAction => ({
  scope: Scopes.PREPARE_GAME, type: ActionTypes.PRE_REVIEW_GAME_BOX, payload: GAME_STATUS_REVIEW_BOX
});

export const prepareResumeGameAction = (): PrepareGameAction => ({
  scope: Scopes.PREPARE_GAME, type: ActionTypes.PRE_RESUME_GAME, payload: GAME_STATUS_PREPARE_CONTINUE
});

export const prepareGoToGameAction = (args: { statusGame: number; studyScore?: StudyScore; boxGame?: number }): PrepareGameAction => ({
  scope: Scopes.PREPARE_GAME, type: ActionTypes.PRE_GO_TO_GAME, payload: args
});
