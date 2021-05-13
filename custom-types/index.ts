import { Category } from '../sub_modules/share/model/category';

export type OtsvCategory = Category & { totalCourses?: number };

export enum CommentScopes {
  COURSE, TOPIC
}
