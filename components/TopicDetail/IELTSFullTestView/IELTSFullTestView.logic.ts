// Action Types

import Skill from "../../../sub_modules/share/model/skill";
import { StudyScore } from "../../../sub_modules/share/model/studyScore";
import { StudyScoreData } from "../../../sub_modules/share/model/studyScoreData";
import { SkillSettingInfo, TopicSetting } from "../../../sub_modules/share/model/topicSetting";

enum ActionTypes {
  INIT_IELTS_SETTING_DATA
}

interface IELTSFullTestViewAction {
  type: ActionTypes;
  topicSetting?: TopicSetting | null;
  skills?: Skill[];
  studyScore?: StudyScore | null;
  mapCardNumSkillType?: {
    [value: number]: number
  }
}

// State

type IELTSFullTestState = {
  listSkillPart: Array<{
    skillInfo: SkillSettingInfo;
    cardCount: number;
    studyScoreData: StudyScoreData | null;
  }>;
  studyScore: StudyScore | null;
}

export const initIELTSFullTestState: IELTSFullTestState = {
  listSkillPart: [],
  studyScore: null
}

// Logic

const init = (args: { topicSetting: TopicSetting | null; skills: Skill[]; studyScore: StudyScore | null; mapCardNumSkillType: { [value: number]: number } }) => {
  const { topicSetting, skills, studyScore, mapCardNumSkillType } = args;
  const listSkillPart = (topicSetting?.skillInfos ?? []).map((skillInfo) => {
    const skill = skills.find((skill) => skill._id == skillInfo.skillId);
    const _skillInfo = new SkillSettingInfo(skillInfo);
    const studyScoreData: StudyScoreData = studyScore?.studyScoreDatas?.find(({ skillId }) => skillId === skillInfo.skillId);
    _skillInfo.skill = skill;
    return {
      skillInfo: _skillInfo,
      cardCount: skill ? (mapCardNumSkillType[skill.type] || 0) : 0,
      studyScoreData: studyScoreData || null
    }
  });
  return {
    listSkillPart,
    studyScore
  }
}

// Reducer & Action Creators

export const IELTSFullTestReducer = (state: IELTSFullTestState, action: IELTSFullTestViewAction): IELTSFullTestState => {
  switch (action.type) {
    case ActionTypes.INIT_IELTS_SETTING_DATA:
      return {
        ...state,
        ...init({
          topicSetting: action.topicSetting || null,
          skills: action.skills || [],
          studyScore: action.studyScore || null,
          mapCardNumSkillType: action.mapCardNumSkillType || {}
        })
      }

    default:
      throw new Error("Unknown Action");
  }
}

export const initIELTSSettingDataAction = (args: { topicSetting: TopicSetting | null; skills: Skill[]; studyScore: StudyScore | null; mapCardNumSkillType: { [value: number]: number } }): IELTSFullTestViewAction => ({
  type: ActionTypes.INIT_IELTS_SETTING_DATA,
  ...args
});

