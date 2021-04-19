import { POST_API, POST_REQ } from '../../sub_modules/common/api'

export const apiGetPagedTopicsByParentId = (args: {
  parentId: string | null; courseId: string;
  asc?: boolean;
  field?: string;
  lastRecord?: any;
  limit?: number;
}) => POST_REQ('get-paged-topics-by-parent-id', args);

export const apiGetTopicsByParentId = (args: { parentId: string | null; courseId?: string; userId?: string }) => POST_API('get-topic-by-parent-id', args);
