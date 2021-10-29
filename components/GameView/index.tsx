import { useEffect, useReducer } from 'react'
import { GAME_STATUS_PREPARE_REVIEW } from '../../sub_modules/game/src/gameConfig'
import { GameData } from '../../sub_modules/game/src/game_core/gameData'
import MainGameView from '../../sub_modules/game/src/main-game/MainGameViewTS'
import { CARD_BOX_NONE, GAME_TYPE_PRACTICE, GAME_TYPE_TEST, TOPIC_CONTENT_TYPE_FILE_PDF, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint'
import MyCardData from '../../sub_modules/share/model/myCardData'
import { StudyScore } from '../../sub_modules/share/model/studyScore'
import Topic from '../../sub_modules/share/model/topic'
import { UserInfo } from '../../sub_modules/share/model/user'
import { getCardByTopicId } from '../../utils/apis/cardApi'
import { gamePageInitState, gamePageReducer, initGamePageStateAction } from './gameView.logic'

const GameView = (props: {
  myCardData?: MyCardData;
  currentTopic: Topic;
  currentUser: UserInfo;
  modeShowResultImmediately: boolean;
  statusGame: number;
  boxGame?: number;
  userIdReview?: string;
  userNameReview?: string;
  studyScore?: StudyScore;
}) => {
  const {
    myCardData,
    currentTopic,
    currentUser,
    modeShowResultImmediately,
    statusGame,
    boxGame,
    userIdReview,
    userNameReview,
    studyScore,
  } = props;

  const [gameState, uiLogic] = useReducer(gamePageReducer, gamePageInitState);
  const _statusGame = boxGame !== CARD_BOX_NONE ? GAME_STATUS_PREPARE_REVIEW : statusGame;

  useEffect(() => {
    if (!currentTopic || !currentUser) return;
    const isTeacherReview = !!userIdReview;
    const isTest = currentTopic.type === TOPIC_TYPE_TEST;
    const contentType = currentTopic.topicExercise.contentType;

    const gameData = new GameData({
      examId: currentTopic._id,
      courseId: currentTopic.courseId,
      duration: 60 * (currentTopic.topicExercise.duration ?? 0),
      title: currentTopic.name,
      pauseTimes: currentTopic.topicExercise.pauseTimes,
      questionsPlayNum: currentTopic.topicExercise.questionsPlayNum,
      isBack: true,
      gameType: isTest ? GAME_TYPE_TEST : GAME_TYPE_PRACTICE,
      userId: userIdReview ?? currentUser._id,
      userName: userNameReview ?? currentUser.name,
      bookmark: isTest,
      pass: currentTopic.topicExercise.pass,
      contentType,
      contentInfo: currentTopic.topicExercise.contentInfo,
      modeShowResultImmediately,
      showAnwserSheet: true,
      saveInPracticeMode: true,
      panelId: contentType === TOPIC_CONTENT_TYPE_FILE_PDF ? 'game-file-pdf' : ''
    });

    getCardByTopicId(currentTopic._id)
      .then((cards) => {
        uiLogic(initGamePageStateAction({
          gameData,
          cards,
          boxGame,
          currentTopic,
          myCardData,
          statusGame: _statusGame,
          studyScoreData: studyScore?.studyScoreData
        }));
      })
  }, []);

  return gameState.gameData
    ? (
      <>
        <MainGameView
          statusGame={_statusGame}
          cards={gameState.cards}
          gameData={gameState.gameData}
          studyScore={studyScore}
          onSubmitted={() => window.history.back()}
          shuffleQuestion={gameState.isShuffleQuestion}
        />
      </>
    )
    : <></>
}

export default GameView;