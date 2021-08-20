import { _Category, _Topic } from '../custom-types';
import { PAGE_CATEGORY_DETAIL, PAGE_COURSE_DETAIL, PAGE_TOPIC_DETAIL } from '../custom-types/PageType';
import { Course } from '../sub_modules/share/model/courses';

export const ROUTER_GAME = '/game';
export const ROUTER_CART = '/gio-hang';
export const ROUTER_PAYMENT = '/thanh-toan';
export const ROUTER_TRANSACTION_HISTORY = '/lich-su-giao-dich';
export const ROUTER_DOCUMENT = '/document';
export const ROUTER_NOT_FOUND = '/404';
export const ROUTER_ERROR = '/500';

export const getBrowserSlug = (slug: string, type: number, id: string) => `${encodeURIComponent(slug)}-${type}-${id}`;

export const getCategorySlug = (args: { category: _Category }) => getBrowserSlug(args.category.slug, PAGE_CATEGORY_DETAIL, args.category._id);

export const getCoursePageSlug = (args: { category: _Category, course: Course }) =>
  `${encodeURIComponent(args.category.slug)}/${getBrowserSlug(args.course.slug, PAGE_COURSE_DETAIL, args.course._id)}`;

export const getTopicPageSlug = (args: { category: _Category, topic: _Topic }) =>
  `${encodeURIComponent(args.category.slug)}/${getBrowserSlug(args.topic.slug, PAGE_TOPIC_DETAIL, args.topic._id)}`;
