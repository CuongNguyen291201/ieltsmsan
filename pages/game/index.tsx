import dynamic from 'next/dynamic';
import { Router, useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import { getSkills } from '../../api/cardApi';
// import { getCardByTopicId } from '../../api/topicApi';
import Layout from '../../components/Layout';
import { useScrollToTop } from '../../hooks/scrollToTop';
// import { actSetCurrentTopic } from '../../redux/actions/topicActions';
import { AppState } from '../../redux/reducers';
import { getSkills } from '../../sub_modules/game/api/ExamApi';
import { GAME_STATUS_PLAYING, GAME_STATUS_PREPARE_REVIEW } from '../../sub_modules/game/src/gameConfig';
import LoadingGame from '../../sub_modules/game/src/game_components/loadingGame';
import { GameData, IGameData } from '../../sub_modules/game/src/game_core/gameData';
import { CARD_BOX_ANSWER_BOOKMARK, CARD_BOX_ANSWER_CORRECT, CARD_BOX_ANSWER_INCORRECT, CARD_BOX_NONE, CARD_BOX_NO_ANSWER, CARD_HAS_CHILD, GAME_TYPE_PRACTICE, GAME_TYPE_TEST, TOPIC_CONTENT_TYPE_FILE_PDF, TOPIC_TYPE_EXERCISE, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import { Card } from '../../sub_modules/share/model/card';
import MyCardData from '../../sub_modules/share/model/myCardData';
import Skill from '../../sub_modules/share/model/skill';
import Topic from '../../sub_modules/share/model/topic';
import { getCardByTopicId } from '../../utils/apis/cardApi';
import './style.scss';

const MainGameView = dynamic(
  () => import('../../sub_modules/game/src/main-game/MainGameViewTS'),
  { ssr: false, loading: () => <LoadingGame /> }
);

function getCardBoxs(myCardData: MyCardData, currentTopic: Topic, cards: Card[], boxGame: number) {
  const cardCorrectArr: string[] = [];
  const cardIncorrectArr: string[] = [];
  // let numCardNotAnswer = 0;
  // let cardNotAnswerArr: string[] = [];
  const cardBookMarkArr: string[] = [];
  // if (currentTopic && currentTopic.topicExercise) {
  //   numCardNotAnswer = currentTopic.topicExercise.questionsNum;
  // }
  if (myCardData) {
    const mapBoxNum: { [box: number]: string[] } = Object.keys(myCardData.boxCard).reduce((map, cardId: string) => {
      const boxNum = myCardData.boxCard[cardId] > 0 ? 1 : 0;
      map[boxNum] = [...map[boxNum], cardId];
      return map;
    }, { 0: [], 1: [] });
    cardCorrectArr.push(...mapBoxNum[1]);
    cardIncorrectArr.push(...mapBoxNum[0]);
    // numCardNotAnswer = numCardNotAnswer - cardCorrectArr.length - cardIncorrectArr.length
    // if (numCardNotAnswer < 0) {
    //   numCardNotAnswer = 0
    // }
    cardBookMarkArr.push(...(myCardData.cardBookmarks ?? []));
  }

  let cardAnswered = cardCorrectArr.concat(cardIncorrectArr)
  let cardCorrect: Card[] = []
  let cardInCorrect: Card[] = []
  let cardNoAnswer: Card[] = []
  let cardBookmarks: Card[] = []

  function pushCardToArr(cardIds: string[], cardId: string, cards: Card[], card: Card) {
    if (cardIds.includes(cardId) && !cards.includes(card)) {
      cards.push(card);
    }
  }

  function pushCardParagraphToArr(cardIds: string[], childCard: Card, cards: Card[], card: Card) {
    const cardIdx = cards.findIndex((cardE) => cardE._id === card._id);
    if (childCard.hasChild === CARD_HAS_CHILD) {
      const leafCards = childCard.childCards.filter((e) => cardIds.includes(e._id));
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
      let childCards = card.childCards.filter((e) => cardIds.includes(e._id));
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
          if (childCard.hasChild === CARD_HAS_CHILD) {
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
          }
        });
      } else {
        if (!cardAnswered.includes(card._id)) {
          if (!cardNoAnswer.includes(card)) {
            cardNoAnswer.push(card);
          }
        }
      }
    }
  });

  if (boxGame === CARD_BOX_ANSWER_CORRECT) return cardCorrect;
  else if (boxGame === CARD_BOX_ANSWER_INCORRECT) return cardInCorrect;
  else if (boxGame === CARD_BOX_ANSWER_BOOKMARK) return cardBookmarks;
  else if (boxGame === CARD_BOX_NO_ANSWER) return cardNoAnswer;
  return [];
}

function GamePage() {
  const [gameOption, setGameOption] = useState<{
    isClient: boolean; gameData: IGameData | null; cards: Card[] | null; skills: Skill[]
  }>({ isClient: false, gameData: null, cards: null, skills: [] });
  const { boxGame, studyScore } = useSelector((state: AppState) => state.prepareGameReducer);
  let { statusGame } = useSelector((state: AppState) => state.prepareGameReducer);
  const { currentTopic, myCardData: userCardData, userToReview, reviewCardData } = useSelector((state: AppState) => state.topicReducer)
  const { currentUser: user } = useSelector((state: AppState) => state.userReducer)
  const { modeShowResultImmediately } = useSelector((state: AppState) => state.gameReducer);
  const myCardData = !!userToReview ? reviewCardData : userCardData;
  const currentUser = !!userToReview ? userToReview : user;
  const router = useRouter();
  useScrollToTop();

  useEffect(() => {
    const parentId = router.query.id
    if (!currentTopic || !parentId) {
      router.back();
      return;
    }

    if (!currentUser) return;

    const gameData = new GameData({
      examId: currentTopic._id,
      courseId: currentTopic.courseId,
      duration: currentTopic.topicExercise.duration * 60,
      title: currentTopic.name,
      pauseTimes: currentTopic.topicExercise.pauseTimes,
      questionsPlayNum: currentTopic.topicExercise.questionsPlayNum,
      isBack: true,
      gameType: currentTopic.type == TOPIC_TYPE_EXERCISE ? GAME_TYPE_PRACTICE : GAME_TYPE_TEST,
      userId: currentUser._id,
      userName: currentUser.name,
      bookmark: currentTopic.type == TOPIC_TYPE_TEST,
      pass: currentTopic.type == TOPIC_TYPE_TEST ? currentTopic.topicExercise.pass : 100,
      contentType: currentTopic.topicExercise.contentType,
      contentInfo: currentTopic.topicExercise.contentInfo,
      modeShowResultImmediately,
      showAnwserSheet: true
    });
    if (gameData.contentType === TOPIC_CONTENT_TYPE_FILE_PDF) {
      gameData.panelId = 'game-file-pdf'
    }
    const getCardByIdsFC = async () => {
      const [cardsResult1, { data: skills }] = await Promise.all([getCardByTopicId(currentTopic._id), getSkills()]);
      const cards: Card[] = boxGame !== CARD_BOX_NONE ? getCardBoxs(myCardData, currentTopic, cardsResult1, boxGame) : cardsResult1;
      setGameOption({ isClient: true, gameData, cards, skills });
    }
    // if (statusGame == GAME_STATUS_NONE) {
    //   statusGame = GAME_STATUS_PREPARE_PLAY
    // }
    if (boxGame !== CARD_BOX_NONE) {
      statusGame = GAME_STATUS_PREPARE_REVIEW
    }
    getCardByIdsFC()
    // dispatch(prepareStartGame(statusGame, studyScore, myCardData, false))
  }, []);
  useEffect(() => {
    const message = 'Do you want to leave?';
    const routeChangeStart = (url: string) => {
      if (statusGame == GAME_STATUS_PLAYING) {
        let currentPath = router.asPath;
        if (currentPath !== url) {
          if (!window?.confirm(message)) {
            Router.events.emit('routeChangeError');
            window.history.forward();
          }
        }
      };
    }
    const beforeunload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    router.events.on('routeChangeStart', routeChangeStart);
    window.addEventListener('beforeunload', beforeunload);
    return () => {
      router.events.off('routeChangeStart', routeChangeStart);
      window.removeEventListener('beforeunload', beforeunload);
    };
  }, [statusGame]);
  return <Layout addMathJax={true} >
    <div>
      {gameOption.isClient && gameOption.gameData ?
        <>
          {/* <TimeOnSite /> */}
          <MainGameView
            statusGame={statusGame}
            cards={gameOption.cards}
            gameData={gameOption.gameData}
            skills={gameOption.skills}
            studyScore={studyScore}
            onSubmitted={() => window.history.back()} />
        </>
        : <></>}
    </div>
  </Layout>
}

export default GamePage
