import { BaseAction } from ".";
import Skill from "../../sub_modules/share/model/skill";
import { ActionTypes, Scopes } from "../types";

export interface ExamAction extends BaseAction {
  scope: typeof Scopes.EXAM
}

export const setExamMapSkillTypeValuesAction = (skills: Skill[]): ExamAction => ({
  scope: Scopes.EXAM, type: ActionTypes.EXAM_SET_MAP_SKILL_TYPE_VALUES, payload: { skills }
});

export const setExerciseOptionsAction = (args: { target: string, value: string | number }): ExamAction => ({
  scope: Scopes.EXAM, target: args.target, type: ActionTypes.EXAM_SET_EXERCISE_OPTIONS, payload: { value: args.value }
})