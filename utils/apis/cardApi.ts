import { POST_API } from '../../sub_modules/common/api';
import { convertCardsToModel } from '../../sub_modules/share/model/card';

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

export const getCardByTopicId = async (topicId: string) => {
  let res = await POST_API(`get-card-by-topic-id`, { topicId });
  let data: any = null;
  if (res.status === 200) {
    data = convertCardsToModel(res.data)
    sortCard(data)
  }
  return data
};