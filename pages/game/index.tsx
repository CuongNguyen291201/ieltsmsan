import { Router, useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getSkills } from '../../api/cardApi';
// import { getCardByTopicId } from '../../api/topicApi';
import Layout from '../../components/Layout';
import { setCurrrentTopicAction } from '../../redux/actions/topic.action';
// import { actSetCurrentTopic } from '../../redux/actions/topicActions';
import { AppState } from '../../redux/reducers';
import { getTopicByIdApi } from '../../sub_modules/common/api/topicApi';
import LoginModal from '../../sub_modules/common/components/loginModal';
import RegisterModal from '../../sub_modules/common/components/registerModal';
import { getSkills } from '../../sub_modules/game/api/ExamApi';
// import TimeOnSite from '../../sub_modules/common/components/time-onsite/index';
import { prepareStartGame } from '../../sub_modules/game/redux/actions/gameAction';
import { GAME_STATUS_NONE, GAME_STATUS_PLAYING, GAME_STATUS_PREPARE_PLAY, GAME_STATUS_PREPARE_REVIEW } from '../../sub_modules/game/src/gameConfig';
import { GameDataModel } from '../../sub_modules/game/src/game_core/gameData';
import PracticeView from '../../sub_modules/game/src/main-game/mainGameView';
import { CARD_BOX_ANSWER_BOOKMARK, CARD_BOX_ANSWER_CORRECT, CARD_BOX_ANSWER_INCORRECT, CARD_BOX_NONE, CARD_BOX_NO_ANSWER, GAME_TYPE_PRACTICE, GAME_TYPE_TEST, TOPIC_CONTENT_TYPE_FILE_PDF, TOPIC_TYPE_EXERCISE, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import { getCardByTopicId } from '../../utils/apis/cardApi';
import './style.scss';


function getCardBoxs(myCardData: any, currentTopic: any, cards: any[]) {
  let cardCorrectArr = [];
  let cardIncorrectArr = [];
  let numCardNotAnswer = 0;
  // let cardNotAnswerArr = []
  let cardBookMarkArr = []
  if (currentTopic && currentTopic.topicExercise) {
    numCardNotAnswer = currentTopic.topicExercise.questionsNum
  }
  if (myCardData) {
    let mapBoxNum = {}
    Object.keys(myCardData.boxCard).map(e => {
      let boxNum = myCardData.boxCard[e] > 0 ? 1 : 0
      mapBoxNum[boxNum] = [...mapBoxNum[boxNum] || [], e];
    })
    cardCorrectArr = mapBoxNum[1] ? mapBoxNum[1] : []
    cardIncorrectArr = mapBoxNum[0] ? mapBoxNum[0] : []
    numCardNotAnswer = numCardNotAnswer - cardCorrectArr.length - cardIncorrectArr.length
    if (numCardNotAnswer < 0) {
      numCardNotAnswer = 0
    }
    cardBookMarkArr = myCardData.cardBookmarks
  }

  let cardAnswered = cardCorrectArr.concat(cardIncorrectArr)
  let cardCorrect = []
  let cardInCorrect = []
  let cardNoAnswer = []
  let cardBookmarks = []

  function pushCardToArr(cardIds: any[], cards: any[], card: any) {
    if (cardIds.includes(card._id)) {
      if (!cards.includes(card)) {
        cards.push(card)
      }
    }
  }
  if (cardBookMarkArr == undefined) {
    cardBookMarkArr = []
  }
  cards.map(card => {
    if (card.hasChild == 1) {
      if (card.childCards) {
        (card.childCards as any[]).map((childCard) => {
          pushCardToArr(cardCorrectArr, cardCorrect, childCard)
          pushCardToArr(cardIncorrectArr, cardInCorrect, childCard)
          pushCardToArr(cardBookMarkArr, cardBookmarks, childCard)
          if (!cardAnswered.includes(childCard._id)) {
            if (!cardNoAnswer.includes(card)) {
              cardNoAnswer.push(card)
            }
          }
        })
      }
    } else {
      pushCardToArr(cardCorrectArr, cardCorrect, card)
      pushCardToArr(cardIncorrectArr, cardInCorrect, card)
      pushCardToArr(cardBookMarkArr, cardBookmarks, card)
      if (!cardAnswered.includes(card._id)) {
        if (!cardNoAnswer.includes(card)) {
          cardNoAnswer.push(card)
        }
      }
    }
  })

  return { cardCorrect, cardInCorrect, cardBookmarks, cardNoAnswer }
}

function GamePage() {
  const [gameOption, setGameOption] = useState({ isClient: false, gameData: null, cards: [], skills: [] })
  const { boxGame } = useSelector((state: AppState) => state.prepareGameReducer);
  let { statusGame } = useSelector((state: AppState) => state.prepareGameReducer);
  const { studyScore, currentTopic, myCardData } = useSelector((state: AppState) => state.topicReducer)
  const { currentUser } = useSelector((state: AppState) => state.userReducer)
  const { modeShowResultImmediately } = useSelector((state: AppState) => state.gameReducer)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    const parentId = router.query.id
    if (!currentTopic || !parentId) {
      router.back()
      return;
    }

    const gameData = GameDataModel(currentTopic._id, {
      courseId: currentTopic.courseId,
      duration: currentTopic.topicExercise.duration * 60,
      title: currentTopic.name,
      pauseTimes: currentTopic.topicExercise.pauseTimes,
      showAnwserSheet: true,
      isBack: true,
      gameType: currentTopic.type == TOPIC_TYPE_EXERCISE ? GAME_TYPE_PRACTICE : GAME_TYPE_TEST,
      userId: currentUser?._id,
      userName: currentUser?.name,
      bookmark: currentTopic.type == TOPIC_TYPE_TEST,
      pass: currentTopic.type == TOPIC_TYPE_TEST ? currentTopic.topicExercise.pass : 100,
      baremScore: currentTopic.topicExercise.baremScore,
      contentType: currentTopic.topicExercise.contentType,
      contentInfo: currentTopic.topicExercise.contentInfo,
      modeShowResultImmediately: modeShowResultImmediately
    })
    Object.assign(gameData, { questionsPlayNum: currentTopic.topicExercise.questionsPlayNum });
    if (gameData.contentType === TOPIC_CONTENT_TYPE_FILE_PDF) {
      gameData.panelId = 'game-file-pdf'
    }
    // gameData.contentType = TOPIC_CONTENT_TYPE_FILE_PDF //currentTopic.topicExercise.contentType
    // gameData.contentInfo = {
    //     linkQuestion: 'https://storage.googleapis.com/ielts-fighters.appspot.com/elearning-react/1608952482660_82796280.pdf',
    //     linkExplanation: 'https://storage.googleapis.com/ielts-fighters.appspot.com/elearning-react/1608952482660_82796280.pdf'
    // },//currentTopic.topicExercise.contentInfo,
    // gameData.panelId = 'game-file-pdf'
    const getCardByIdsFC = async () => {
      // const skillsResult = new Promise(async resolve => {
      //   let data = await getSkills()
      //   resolve(data.data)
      // });

      // const cardsResult = new Promise(async resolve => {
      //   let data = await getCardByTopicId(currentTopic._id)
      //   resolve(data)
      // });
      const [cardsResult, { data: skillsResult }] = await Promise.all([getCardByTopicId(currentTopic._id), getSkills()])
      // let cardResult = dataResult[0]
      let cards = []
      if (boxGame != CARD_BOX_NONE) {
        const { cardCorrect, cardInCorrect, cardBookmarks, cardNoAnswer } = getCardBoxs(myCardData, currentTopic, cardsResult)
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
        cards = cardsResult;
      }
      setGameOption({ isClient: true, gameData, cards, skills: skillsResult })
    }
    if (statusGame == GAME_STATUS_NONE) {
      statusGame = GAME_STATUS_PREPARE_PLAY
    }
    if (boxGame != CARD_BOX_NONE) {
      statusGame = GAME_STATUS_PREPARE_REVIEW
    }
    getCardByIdsFC()
    dispatch(prepareStartGame(statusGame, studyScore, myCardData, false))
  }, [currentTopic, currentUser])
  useEffect(() => {
    const message = 'Do you want to leave?';
    const routeChangeStart = (url: string) => {
      if (statusGame == GAME_STATUS_PLAYING) {
        let currentPath = router.asPath
        if (currentPath !== url) {
          if (!confirm(message)) {
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
          <PracticeView cards={gameOption.cards} gameData={gameOption.gameData} skills={gameOption.skills} />
        </>
        : <></>}
    </div>
    <LoginModal />
    <RegisterModal />
  </Layout>
}

export default GamePage
