import { Category } from '../sub_modules/share/model/category';
import Discussion from '../sub_modules/share/model/discussion';

export type OtsvCategory = Category & { totalCourses?: number };

export type Comment = Discussion & { totalReplies?: number };

export enum CommentScopes {
  COURSE, TOPIC
}
