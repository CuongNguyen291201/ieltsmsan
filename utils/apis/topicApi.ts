import { getEndpoint } from ".";
import { _Topic } from '../../custom-types';
import { POST_API, POST_REQ } from '../../sub_modules/common/api';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import Document from "../../sub_modules/share/model/document";
import MyCardData from '../../sub_modules/share/model/myCardData';
import ScenarioInfo from "../../sub_modules/share/model/scenarioInfo";
import Skill from "../../sub_modules/share/model/skill";
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import { StudyScoreData } from "../../sub_modules/share/model/studyScoreData";
import Topic from '../../sub_modules/share/model/topic';
import { TopicExercise } from '../../sub_modules/share/model/topicExercise';
import { ITopicProgress } from '../../sub_modules/share/model/topicProgress';
import { TopicSetting } from "../../sub_modules/share/model/topicSetting";

export const apiSeekTopicsByParentId = (args: {
  parentId: string | null; courseId: string;
  asc?: boolean;
  field?: string;
  lastRecord?: Topic;
  limit?: number;
  userId?: string;
}) => POST_REQ('seek-topics-by-parent-id', args);

export const apiOffsetTopicsByParentId = (args: {
  parentId: string | null; courseId: string;
  asc?: boolean;
  field?: string;
  skip?: number;
  limit?: number;
  userId?: string;
}) => POST_REQ('offset-topics-by-parent-id', args);

export const apiCountTopicsByParentId = async (args: {
  parentId: string | null;
  courseId: string;
}) => {
  const { data, status } = await POST_API('count-topics-by-parent-id', args);
  if (status !== response_status_codes.success) return { total: 0 };
  return data;
};

export const apiGetTopicsByParentId = (args: { parentId: string | null; courseId?: string; userId?: string; }) => POST_API('get-topic-by-parent-id', args);

export const apiGetDataDetailExercise = async (args: {
  topicId: string; userId?: string | null; type: number;
}) => {
  const response = await POST_API('get-data-detail-exercise', args);
  if (response.status === response_status_codes.success) {
    const { topicExercise, studyScore, myCardData } = response.data;
    return {
      topicExercise: topicExercise ? new TopicExercise(topicExercise) : null,
      studyScore: studyScore ? new StudyScore(studyScore) : null,
      myCardData: myCardData ? new MyCardData(myCardData) : null
    };
  }
  return null;
};

export const apiGetTopicById = async (args: { topicId: string; serverSide?: boolean }): Promise<_Topic | null> => {
  const response = await POST_API(getEndpoint('api/get-topic-by-id', args.serverSide), { topicId: args.topicId, withCourse: true });
  if (response.status === response_status_codes.success) {
    return response.data;
  }
  return null;
};

export const apiSeekRankingsByTopic = (args: {
  field?: 'currentIndex' | 'lastUpdate',
  topicId: string;
  limit?: number;
  lastRecord?: StudyScore;
  asc?: boolean;
}) => POST_API('seek-rankings-by-topic', args);

export const apiOffsetRankingsByTopic = (args: {
  field?: 'score' | 'lastUpdate',
  topicId: string;
  limit?: number;
  skip?: number;
  asc?: boolean;
}) => POST_API('offset-rankings-by-topic', args);

export const apiCountTopicStudyScores = async (args: { topicId: string; status?: number | number[]; }) => {
  try {
    const { data, status } = await POST_API('count-topic-study-scores', args);
    if (status === response_status_codes.success) return data;
    return { total: 0 };
  } catch (e) {
    return { total: 0 };
  }
};

export const apiGetUserExamCardData = async (args: { topicId: string; userId: string; type: number; studyScore: StudyScore; }) => POST_API('get-user-exam-card-data', args);

export const apiUpdateTopicProgress = (args: { topicId: string; progress: number; userId: string }) => POST_API('update-topic-progress', args);

export const apiGetTopicProgress = (args: ITopicProgress) => POST_API('get-topic-progress', args);

export const getOneVideoScenarioAPI = async (object) => {
  let res = await POST_API(`/get-data-detail-lesson`, object)
  let data
  if (res.status === 200) {
    data = res.data
  }
  return data
}

export const apiGetDataDetailLesson = async (args: { topicId: string }): Promise<{
  scenarioInfos: ScenarioInfo[];
  documents: Document[]
}> => {
  const { data, status } = await POST_API(`/get-data-detail-lesson`, args)
  if (status !== response_status_codes.success) return { scenarioInfos: [], documents: [] };
  return data
}

export const apiGetTimeStamp = async (): Promise<{ timeStamp: number }> => {
  const res = await POST_API('check-time-stamp', {})
  if (res.status === 200) {
    return res.data
  }
  return { timeStamp: null }
};

export const apiGetIELTSTopicData = async (args: { topicId: string; userId?: string }): Promise<{
  topicSetting: TopicSetting | null;
  skills: Skill[];
  studyScore: StudyScore | null;
  mapCardNumSkillType: {
    [value: number]: number
  }
}> => {
  const { data, status } = await POST_API('/get-data-detail-ielts', args);
  if (status !== 200) return {
    topicSetting: null, skills: [], studyScore: null, mapCardNumSkillType: {}
  };
  return data;
}

export const apiGetLatestTopicStudyScoreData = async (args: { topicId: string; skillId?: string; status?: number | number[] }): Promise<StudyScoreData[]> => {
  const { data, status } = await POST_API('/get-latest-topic-study-score-data', args);
  if (status !== 200) return [];
  return data;
}
