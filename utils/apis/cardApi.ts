import { POST_API } from '../../sub_modules/common/api';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import { Card } from '../../sub_modules/share/model/card';

export const getCardByTopicId = async (topicId: string, cardType?: number[]): Promise<Card[]> => {
  const { data, status } = await POST_API(`get-card-by-topic-id`, { topicId, type: (cardType ?? []) });
  if (status === response_status_codes.success) {
    return data as Card[];
  }
  return [];
};