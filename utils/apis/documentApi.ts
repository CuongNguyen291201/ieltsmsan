import { POST_API } from '../../sub_modules/common/api';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import { STATUS_PUBLIC } from "../../sub_modules/share/constraint";
import Document, { IDocument } from "../../sub_modules/share/model/document";

export const apiSeekDocumentByTopic = (args: {
  parentId: string;
  field?: any;
  asc?: boolean;
  limit?: number;
  lastRecord?: any
}) => POST_API('seek-document-by-topic', args);

export const apiOffsetDocumentsByTopic = async (args: {
  skip?: number;
  field: keyof IDocument;
  limit?: number;
  asc?: boolean;
  parentId: string;
}): Promise<Document[]> => {
  const { data, status } = await POST_API('offset-document-by-topic', args, 'api');
  if (status !== response_status_codes.success) return [];
  return data;
}

export const apiCountDocumentsByTopic = async (topicId: string): Promise<{ total: number }> => {
  const { data, status } = await POST_API('count-documents-by-topic', {
    parentId: topicId,
    status: STATUS_PUBLIC
  }, 'api');
  if (status !== response_status_codes.success) return { total: 0 };
  return data;
}

