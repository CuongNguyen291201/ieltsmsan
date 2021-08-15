import { POST_API } from '../../sub_modules/common/api';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import { Card, convertCardsToModel } from '../../sub_modules/share/model/card';

function sortCard(cardResult: any[]) {
  cardResult.sort((a, b) => {
    return a.orderIndex < b.orderIndex ? -1 : 1
  })
  let currentIndex = 0;
  cardResult.forEach((card) => {
    if (card.hasChild == 1) {
      card.orderIndex = currentIndex
      if (card.childCards) {
        card.childCards.map(childCard => {
          childCard.orderIndex = currentIndex++
        })
      }
    } else {
      card.orderIndex = currentIndex++
    }
  })
}

export const getCardByTopicId = async (topicId: string, cardType?: number[]): Promise<Card[]> => {
  const { data, status } = await POST_API(`get-card-by-topic-id`, { topicId, type: (cardType ?? []) });
  if (status === response_status_codes.success) {
    return data as Card[];
  }
  return [];
};