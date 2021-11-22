import { BaseAction } from ".";
import Skill from "../../sub_modules/share/model/skill";
import { ActionTypes, Scopes } from "../types";

export interface ExamAction extends BaseAction {
  scope: typeof Scopes.EXAM
}

export const setExamMapSkillTypeValuesAction = (skills: Skill[]): ExamAction => ({
  scope: Scopes.EXAM, type: ActionTypes.EXAM_SET_MAP_SKILL_TYPE_VALUES, payload: { skills }
});