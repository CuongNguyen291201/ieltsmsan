import { Category } from '../sub_modules/share/model/category';
import Discussion from '../sub_modules/share/model/discussion';
import Topic from '../sub_modules/share/model/topic';
import TopicProgress from '../sub_modules/share/model/topicProgress';

export type OtsvCategory = Category & { totalCourses?: number };

export type Comment = Discussion & { totalReplies?: number };

export enum CommentScopes {
  COURSE, TOPIC
}

export type OtsvTopic = Topic & { topicProgress?: TopicProgress}
