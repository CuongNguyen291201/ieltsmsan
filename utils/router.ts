import { _Category, _Topic } from '../custom-types';
import { PAGE_CATEGORY_DETAIL, PAGE_COURSE_DETAIL, PAGE_TOPIC_DETAIL } from '../custom-types/PageType';
import { Course } from '../sub_modules/share/model/courses';

export const ROUTER_GAME = '/game';
export const ROUTER_NEWS = '/tin-tuc';
export const ROUTER_CART = '/gio-hang';
export const ROUTER_PAYMENT = '/thanh-toan';
export const ROUTER_COURSE_DETAIL = '/khoa-hoc';
export const ROUTER_TOPIC_DETAIL = '/bai-hoc';
export const ROUTER_MY_COURSES = '/khoa-hoc-cua-toi';
export const ROUTER_COURSE_MEMBERS = '/thanh-vien';
export const ROUTER_TRANSACTION_HISTORY = '/lich-su-giao-dich';
export const ROUTER_DOCUMENT = '/tai-lieu';
export const ROUTER_NOT_FOUND = '/404';
export const ROUTER_ERROR = '/500';
export const ROUTER_LOGIN = '/login';
export const ROUTER_REGISTER = '/register';

export const NEWS_ID_PREFIX = 'post';

export const getBrowserSlug = (slug: string, type: number, id: string) => `/${encodeURIComponent(slug)}-${type}-${id}`;

export const getCategorySlug = (args: { category: _Category }) => getBrowserSlug(args.category.slug, PAGE_CATEGORY_DETAIL, args.category._id);

export const getCoursePageSlug = (args: { course: Course }) =>
  `${ROUTER_COURSE_DETAIL}/${encodeURIComponent(args.course.slug)}-${args.course._id}`;

export const getTopicPageSlug = (args: { topic: _Topic }) =>
  `${ROUTER_TOPIC_DETAIL}/${encodeURIComponent(args.topic.slug)}-${args.topic._id}`;

export const getPaymentPageSlug = (...courseIds: string[]) =>
  `${ROUTER_PAYMENT}?courseIds=${courseIds.join(',')}`;

export const getCourseMembersPageSlug = (args: { course: Course }) =>
  `${ROUTER_COURSE_MEMBERS}/${encodeURIComponent(args.course.slug)}-${args.course._id}`;
  