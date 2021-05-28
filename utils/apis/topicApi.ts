import { POST_API, POST_REQ } from '../../sub_modules/common/api';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import MyCardData from '../../sub_modules/share/model/myCardData';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import Topic from '../../sub_modules/share/model/topic';
import { TopicExercise } from '../../sub_modules/share/model/topicExercise';
import { ITopicProgress } from '../../sub_modules/share/model/topicProgress';

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
  lastRecord?: Topic;
  limit?: number;
}) => POST_REQ('offset-topics-by-parent-id', args);

export const apiCountTopicsByParentId = async (args: {
  parentId: string | null;
  courseId: string;
}) => {
  try {
    const { data, status } = await POST_API('count-topics-by-parent-id', args);
    if (status !== response_status_codes.success) return { total: 0 };
    return data;
  } catch (e) {
    return { total: 0 };
  }
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

export const apiGetTopicById = async (topicId: string) => {
  const response = await POST_API('get-topic-by-id', { topicId, withCourse: true });
  if (response.status === response_status_codes.success) {
    return response.data;
  }
  return null;
};

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

