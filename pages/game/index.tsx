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
import { GameData, IGameData } from '../../sub_modules/game/src/game_core/gameData';
import { CARD_BOX_ANSWER_BOOKMARK, CARD_BOX_ANSWER_CORRECT, CARD_BOX_ANSWER_INCORRECT, CARD_BOX_NONE, CARD_BOX_NO_ANSWER, CARD_HAS_CHILD, GAME_TYPE_PRACTICE, GAME_TYPE_TEST, TOPIC_CONTENT_TYPE_FILE_PDF, TOPIC_TYPE_EXERCISE, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import { Card } from '../../sub_modules/share/model/card';
import MyCardData from '../../sub_modules/share/model/myCardData';
import Skill from '../../sub_modules/share/model/skill';
import Topic from '../../sub_modules/share/model/topic';
import { getCardByTopicId } from '../../utils/apis/cardApi';
import './style.scss';
const MainGameView = dynamic(() => import('../../sub_modules/game/src/main-game/MainGameViewTS'), { ssr: false });

function getCardBoxs(myCardData: MyCardData, currentTopic: Topic, cards: Card[]) {
  let cardCorrectArr: string[] = [];
  let cardIncorrectArr: string[] = [];
  let numCardNotAnswer = 0;
  // let cardNotAnswerArr: Card[] = [];
  let cardBookMarkArr: string[] = [];
  if (currentTopic && currentTopic.topicExercise) {
    numCardNotAnswer = currentTopic.topicExercise.questionsNum;
  }
  if (myCardData) {
    let mapBoxNum: { [x: number]: string[] } = {}
    Object.keys(myCardData.boxCard).map((cardId: string) => {
      let boxNum = myCardData.boxCard[cardId] > 0 ? 1 : 0;
      mapBoxNum[boxNum] = [...(mapBoxNum[boxNum] || []), cardId];
    });
    cardCorrectArr = mapBoxNum[1] ? mapBoxNum[1] : []
    cardIncorrectArr = mapBoxNum[0] ? mapBoxNum[0] : []
    numCardNotAnswer = numCardNotAnswer - cardCorrectArr.length - cardIncorrectArr.length
    if (numCardNotAnswer < 0) {
      numCardNotAnswer = 0
    }
    cardBookMarkArr = myCardData.cardBookmarks
  }

  let cardAnswered = cardCorrectArr.concat(cardIncorrectArr)
  let cardCorrect: Card[] = []
  let cardInCorrect: Card[] = []
  let cardNoAnswer: Card[] = []
  let cardBookmarks: Card[] = []

  function pushCardToArr(cardIds: string[], cards: Card[], card: Card) {
    if (cardIds.includes(card._id) && !cards.find((e) => e._id === card._id)) cards.push(card);
  }

  function pushCardParagraphToArr(cardIds: string[], cards: Card[], card: Card) {
    const hasCard = !!cards.find((e) => e._id === card._id);
    const childCards = (card.childCards || []).filter((e) => cardIds.includes(e._id));
    if (!hasCard && !!childCards.length) {
      card.childCards = childCards;
      cards.push(card);
    }
  }

  if (!cardBookMarkArr) {
    cardBookMarkArr = [];
  }

  cards.map((card) => {
    if (card.hasChild === CARD_HAS_CHILD) {
      card.childCards?.map((childCard) => {
        pushCardParagraphToArr(cardCorrectArr, cardCorrect, childCard);
        pushCardParagraphToArr(cardIncorrectArr, cardInCorrect, childCard);
        pushCardParagraphToArr(cardBookMarkArr, cardBookmarks, childCard);

        if (!cardAnswered.includes(childCard._id) && !cardNoAnswer.find((e) => e._id === card._id)) {
          cardNoAnswer.push(card);
        }
      });
    } else {
      pushCardToArr(cardCorrectArr, cardCorrect, card)
      pushCardToArr(cardIncorrectArr, cardInCorrect, card)
      pushCardToArr(cardBookMarkArr, cardBookmarks, card)
      if (!cardAnswered.includes(card._id) && !cardNoAnswer.find((e) => e._id === card._id)) {
        cardNoAnswer.push(card);
      }
    }
  });

  return { cardCorrect, cardInCorrect, cardBookmarks, cardNoAnswer };
}

function GamePage() {
  const [gameOption, setGameOption] = useState<{
    isClient: boolean;
    gameData: IGameData | null;
    cards: Card[] | null;
    skills: Skill[]
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
      const [cardsResult, { data: skills }] = await Promise.all([getCardByTopicId(currentTopic._id), getSkills()]);
      let cards: Card[] = []
      if (boxGame != CARD_BOX_NONE) {
        const { cardCorrect, cardInCorrect, cardBookmarks, cardNoAnswer } = getCardBoxs(myCardData, currentTopic, cardsResult as Card[])
        if (boxGame == CARD_BOX_ANSWER_INCORRECT) {
          cards = cardInCorrect
        } else if (boxGame == CARD_BOX_ANSWER_CORRECT) {
          cards = cardCorrect
        } else if (boxGame == CARD_BOX_ANSWER_BOOKMARK) {
          cards = cardBookmarks
        } else if (boxGame == CARD_BOX_NO_ANSWER) {
          cards = cardNoAnswer
        }
      } else {
        cards = cardsResult as Card[];
      }
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
