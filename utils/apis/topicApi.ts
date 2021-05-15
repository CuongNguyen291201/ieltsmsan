import { POST_API, POST_REQ } from '../../sub_modules/common/api';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import MyCardData from '../../sub_modules/share/model/myCardData';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import { TopicExercise } from '../../sub_modules/share/model/topicExercise';

export const apiSeekTopicsByParentId = (args: {
  parentId: string | null; courseId: string;
  asc?: boolean;
  field?: string;
  lastRecord?: any;
  limit?: number;
}) => POST_REQ('seek-topics-by-parent-id', args);

export const apiGetTopicsByParentId = (args: { parentId: string | null; courseId?: string; userId?: string }) => POST_API('get-topic-by-parent-id', args);

export const apiGetDataDetailExercise = async (args: {
  topicId: string; userId?: string | null; type: number
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
}

export const apiGetTopicById = async (topicId: string) => {
  const response = await POST_API('get-topic-by-id', { topicId });
  if (response.status === response_status_codes.success) {
    return response.data;
  }
  return null;
}

export const apiSeekRankingsByTopic = (args: {
  field?: 'score' | 'lastUpdate',
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

export const apiCountTopicStudyScores = async (args: { topicId: string; status?: number | number[] }) => {
  try {
    const { data, status } = await POST_API('count-topic-study-scores', args);
    if (status === response_status_codes.success) return data;
    return { total: 0 }
  } catch (e) {
    return { total: 0 };
  }
}

export const apiGetUserExamCardData = async (args: { topicId: string; userId: string; type: number; studyScore: StudyScore }) => POST_API('get-user-exam-card-data', args);
