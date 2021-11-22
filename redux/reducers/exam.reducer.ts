import { MapSkillTypeValues } from "../../sub_modules/game/src/game_core/gameData"
import Skill from "../../sub_modules/share/model/skill"
import { ExamAction } from "../actions/exam.action"
import { ActionTypes, Scopes } from "../types"

export interface ExamState {
  mapSkillTypeValues: MapSkillTypeValues;
}

const initialState: ExamState = {
  mapSkillTypeValues: {}
}

const getMapSkillTypeValues = (skills: Skill[]): MapSkillTypeValues => {
  return skills.reduce((map, skill) => {
    map[skill.type] = [skill.value, ...(skill.childSkills).map((c) => c.value)];
    return map;
  }, {});
}

export const examReducer = (state = initialState, action: ExamAction): ExamState => {
  if (action?.scope === Scopes.EXAM) {
    switch (action.type) {
      case ActionTypes.EXAM_SET_MAP_SKILL_TYPE_VALUES:
        return {
          ...state,
          mapSkillTypeValues: getMapSkillTypeValues(action.payload.skills)
        }
      default:
        return state;
    }
  }
  return state;
}