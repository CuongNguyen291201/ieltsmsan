import { POST_API } from '../../sub_modules/common/api';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';

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

export const apiCountDocumentsByTopic = async (parentId: string): Promise<{ total: number; }> => {
  const { data, status } = await POST_API('count-documents-by-topic', { parentId });
  if (status === response_status_codes.success) return data;
  return { total: 0 }
}

