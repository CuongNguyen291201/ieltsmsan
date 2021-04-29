import { POST_API } from '../../sub_modules/common/api';

export const apiSeekDocumentByTopic = (args: {
  parentId: string;
  field?: any;
  asc?: boolean;
  limit?: number;
  lastRecord?: any
}) => POST_API('seek-document-by-topic', args);

export const apiOffsetDocumentByTopic = (args: {
  parentId: string;
  field?: any;
  asc?: boolean;
  limit?: number;
  skip?: number
}) => POST_API('offset-document-by-topic', args);
