import _ from 'lodash';
import { GameData } from '../../sub_modules/game/src/game_core/gameData';
import { CARD_BOX_ANSWER_BOOKMARK, CARD_BOX_ANSWER_CORRECT, CARD_BOX_ANSWER_INCORRECT, CARD_BOX_NONE, CARD_BOX_NO_ANSWER, CARD_HAS_CHILD, TOPIC_CONTENT_TYPE_FLASH_CARD } from '../../sub_modules/share/constraint';
import { Card } from '../../sub_modules/share/model/card';
import Skill from '../../sub_modules/share/model/skill';
import MyCardData from '../../sub_modules/share/model/myCardData';
import Topic from '../../sub_modules/share/model/topic';
import { StudyScoreData } from '../../sub_modules/share/model/studyScoreData';
import { GAME_STATUS_NONE, GAME_STATUS_PREPARE_CONTINUE, GAME_STATUS_PREPARE_PLAY } from '../../sub_modules/game/src/gameConfig';

// Action Types
export enum GamePageActionTypes {
  INIT_GAME_STATE = 'INIT_GAME_STATE'
}

interface GamePageAction {
  type: GamePageActionTypes,
  gameData?: GameData;
  cards?: Card[];
  isShuffleQuestion?: boolean;
  skills?: Skill[]
}

// States

export type GamePageState = {
  gameData: GameData | null;
  cards: Card[] | null;
  skills: Skill[] | null;
  isShuffleQuestion: boolean;
}

export const gamePageInitState: GamePageState = {
  gameData: null,
  cards: null,
  skills: null,
  isShuffleQuestion: false
}

// Reducers

export function gamePageReducer(state: GamePageState = gamePageInitState, action: GamePageAction): GamePageState {
  switch (action.type) {
    case GamePageActionTypes.INIT_GAME_STATE:
      return {
        ...state,
        gameData: action.gameData,
        cards: action.cards,
        skills: action.skills,
        isShuffleQuestion: action.isShuffleQuestion
      }

    default:
      return state;
  }
}

// Action Creators & logic

/**
 * 
 * @param cards - topic's cards
 * @param isShuffleQuestion topic's questions is shuffled
 */
function sortCards(cards: Card[], isShuffleQuestion: boolean) {
  const _cards = isShuffleQuestion ? (_.shuffle(cards)).map((card, i) => ({ ...card, orderIndex: i })) : cards;
  if (!isShuffleQuestion) _cards.sort((a, b) => a.orderIndex - b.orderIndex);

  let currentIndex = 0;
  _cards.forEach((card) => {
    if (card.hasChild === CARD_HAS_CHILD) {
      card.orderIndex = currentIndex;
      if (card.childCards) {
        card.childCards.map((childCard) => {
          if (childCard.hasChild !== CARD_HAS_CHILD) {
            childCard.orderIndex = currentIndex++;
          } else {
            childCard.childCards.map((childCard2) => {
              childCard2.orderIndex = currentIndex++;
            });
          }
        })
      }
    } else {
      card.orderIndex = currentIndex++;
    }
  });

  return _cards;
}

/**
 * 
 * @param myCardData Card Data for practice topics
 * @param currentTopic topic
 * @param cards topic's cards
 * @param boxGame type review box
 * @returns card boxs in type review box
 */
function getCardBoxs(myCardData: MyCardData, currentTopic: Topic, cards: Card[], boxGame: number) {
  const cardCorrectArr: string[] = [];
  const cardIncorrectArr: string[] = [];
  const cardBookMarkArr: string[] = [];
  if (myCardData) {
    const mapBoxNum = Object.keys(myCardData.boxCard).reduce((map, cardId) => {
      const boxNum = myCardData.boxCard[cardId] > 0 ? 1 : 0;
      map[boxNum] = [...map[boxNum], cardId];
      return map;
    }, { 0: [], 1: [] });

    cardCorrectArr.push(...mapBoxNum[1]);
    cardIncorrectArr.push(...mapBoxNum[0]);
    cardBookMarkArr.push(...(myCardData.cardBookmarks || []));
  }
  const cardAnswered = cardCorrectArr.concat(cardIncorrectArr);
  const cardCorrect: Card[] = [];
  const cardInCorrect: Card[] = [];
  const cardNoAnswer: Card[] = [];
  const cardBookmarks: Card[] = [];

  function includeCheck(arr: string[], id: string, isInclude: boolean) {
    return isInclude ? arr.includes(id) : !arr.includes(id)
  }

  function pushCardToArr(cardIds: string[], cardId: string, cards: Card[], card: Card, isInclude: boolean = true) {
    if (includeCheck(cardIds, cardId, isInclude)) {
      if (!cards.includes(card)) {
        cards.push(card);
      }
    }
  }

  function pushCardParagraphToArr(cardIds: string[], childCard: Card, cards: Card[], card: Card, isInclude: boolean = true) {
    const cardIdx = cards.findIndex((cardE) => cardE._id === card._id);
    if (childCard.hasChild === CARD_HAS_CHILD) {
      const leafCards = childCard.childCards.filter((e) => includeCheck(cardIds, e._id, isInclude));
      if (leafCards.length > 0) {
        // childCard.childCards = leafCards
        const newChild = { ...childCard, childCards: leafCards };
        const childIdx = card.childCards.findIndex(({ _id }) => newChild._id === _id);
        card.childCards.splice(childIdx, 1, newChild);
        if (cardIdx === -1) {
          cards.push(card);
        } else {
          const cardIdx = cards.findIndex(({ _id }) => card._id === _id);
          cards.splice(cardIdx, 1, card)
        }
      }
    } else {
      let childCards = card.childCards.filter((e) => includeCheck(cardIds, e._id, isInclude));
      if (cardIdx === -1 && childCards.length > 0) {
        let newCard = { ...card, childCards };
        cards.push(newCard);
      }
    }
  }

  cards.map((card) => {
    if (boxGame === CARD_BOX_ANSWER_CORRECT) {
      if (card.hasChild === CARD_HAS_CHILD) {
        card.childCards?.map((childCard) => {
          pushCardParagraphToArr(cardCorrectArr, childCard, cardCorrect, card);
        });
      } else {
        pushCardToArr(cardCorrectArr, card._id, cardCorrect, card)
      }
    } else if (boxGame === CARD_BOX_ANSWER_INCORRECT) {
      if (card.hasChild === CARD_HAS_CHILD) {
        card.childCards?.map((childCard) => {
          pushCardParagraphToArr(cardIncorrectArr, childCard, cardInCorrect, card);
        });
      } else {
        pushCardToArr(cardIncorrectArr, card._id, cardInCorrect, card)
      }
    } else if (boxGame === CARD_BOX_ANSWER_BOOKMARK) {
      if (card.hasChild === CARD_HAS_CHILD) {
        card.childCards?.map((childCard) => {
          pushCardParagraphToArr(cardBookMarkArr, childCard, cardBookmarks, card);
        });
      } else {
        pushCardToArr(cardBookMarkArr, card._id, cardBookmarks, card)
      }
    } else if (boxGame === CARD_BOX_NO_ANSWER) {
      if (card.hasChild === CARD_HAS_CHILD) {
        card.childCards?.map((childCard) => {
          pushCardParagraphToArr(cardAnswered, childCard, cardNoAnswer, card, false);
          /* if (childCard.hasChild === CARD_HAS_CHILD) {
            const notAnswerChilds = childCard.childCards.filter((e) => !cardAnswered.includes(e._id));
            if (!!notAnswerChilds.length) {
              const newChild = { ...childCard, childCards: notAnswerChilds };
              const childIdx = card.childCards.findIndex(({ _id }) => childCard._id === _id);
              card.childCards.splice(childIdx, 1, newChild);
              const cardIdxNoAnswer = cardNoAnswer.findIndex(({ _id }) => card._id === _id);
              if (cardIdxNoAnswer === -1) {
                cardNoAnswer.push(card);
              } else {
                cardNoAnswer.splice(cardIdxNoAnswer, 1, card);
              }
            }
          } else {
            if (!cardAnswered.includes(childCard._id)) {
              if (!cardNoAnswer.includes(card)) {
                cardNoAnswer.push(card);
              }
            }
          } */
        });
      } else {
        pushCardToArr(cardAnswered, card._id, cardNoAnswer, card, false);
        /* if (!cardAnswered.includes(card._id)) {
          if (!cardNoAnswer.includes(card)) {
            cardNoAnswer.push(card);
          }
        } */
      }
    }
  });
  if (boxGame === CARD_BOX_ANSWER_CORRECT) return cardCorrect;
  else if (boxGame === CARD_BOX_ANSWER_INCORRECT) return cardInCorrect;
  else if (boxGame === CARD_BOX_ANSWER_BOOKMARK) return cardBookmarks;
  else if (boxGame === CARD_BOX_NO_ANSWER) return cardNoAnswer;
  return [];
}

export const initGamePageStateAction = (args: {
  gameData: GameData;
  cards: Card[];
  boxGame: number;
  skills: Skill[];
  myCardData: MyCardData;
  currentTopic: Topic;
  statusGame: number;
  studyScoreData?: StudyScoreData;
}): GamePageAction => {
  const { gameData, cards, skills, boxGame = CARD_BOX_NONE, myCardData, currentTopic, statusGame, studyScoreData } = args;
  const shuffleQuestionOrder = studyScoreData?.shuffleQuestionOrder ?? [];
  const isPrepareToPlay = statusGame === GAME_STATUS_NONE;
  const isPrepareToContinue = statusGame === GAME_STATUS_PREPARE_CONTINUE;
  const isGameFlashCard = currentTopic.topicExercise.contentType === TOPIC_CONTENT_TYPE_FLASH_CARD;

  if (!!shuffleQuestionOrder.length && !isPrepareToPlay) {
    cards.forEach((card) => {
      const idx = shuffleQuestionOrder.findIndex((_id) => String(_id) === String(card._id));
      if (idx !== -1) card.orderIndex = idx;
    });
  }
  const isShuffleQuestion = !!currentTopic.topicExercise?.shuffleQuestion && isPrepareToPlay;
  
  const _cards = !isGameFlashCard ? sortCards(cards, isShuffleQuestion) : cards;

  return {
    type: GamePageActionTypes.INIT_GAME_STATE,
    gameData,
    cards: boxGame !== CARD_BOX_NONE ? getCardBoxs(myCardData, currentTopic, _cards, boxGame) : _cards,
    isShuffleQuestion,
    skills
  }
}
