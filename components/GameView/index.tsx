import { useEffect, useMemo, useReducer } from 'react'
import { getSkills } from "../../sub_modules/game/api/ExamApi"
import { GAME_STATUS_PREPARE_REVIEW } from '../../sub_modules/game/src/gameConfig'
import { GameData } from '../../sub_modules/game/src/game_core/gameData'
import MainGameView from '../../sub_modules/game/src/main-game/MainGameViewTS'
import { CARD_BOX_NONE, EXAM_TYPE_IELTS, GAME_TYPE_PRACTICE, GAME_TYPE_TEACHER_REVIEW, GAME_TYPE_TEST, GAME_TYPE_USER_REVIEW, SKILL_TYPE_LISTENING, SKILL_TYPE_READING, SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING, TOPIC_CONTENT_TYPE_FILE_PDF, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint'
import MyCardData from '../../sub_modules/share/model/myCardData'
import { StudyScore } from '../../sub_modules/share/model/studyScore'
import Topic from '../../sub_modules/share/model/topic'
import { SkillSettingInfo } from "../../sub_modules/share/model/topicSetting"
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
  skillSettingInfo?: SkillSettingInfo;
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
    skillSettingInfo
  } = props;

  const [gameState, uiLogic] = useReducer(gamePageReducer, gamePageInitState);
  const _statusGame = boxGame !== CARD_BOX_NONE ? GAME_STATUS_PREPARE_REVIEW : statusGame;

  const skillTypes = useMemo(() => skillSettingInfo?.skill
    ? [skillSettingInfo.skill.value, ...(skillSettingInfo.skill.childSkills ?? []).map(({ value }) => value)]
    : undefined
    , [skillSettingInfo]);

  useEffect(() => {
    if (!currentTopic || !currentUser) return;
    const isTeacherReview = !!userIdReview;
    const isTest = currentTopic.type === TOPIC_TYPE_TEST;
    const contentType = currentTopic.topicExercise.contentType;
    const isIELTSGame = contentType === EXAM_TYPE_IELTS;
    const title = isIELTSGame ? '' : currentTopic.name;
    const duration = isIELTSGame && isTest ? skillSettingInfo?.skill?.timeStudy : 60 * (currentTopic.topicExercise.duration ?? 0);

    const gameData = new GameData({
      examId: currentTopic._id,
      courseId: currentTopic.courseId,
      skillId: skillSettingInfo?.skillId,
      duration,
      title,
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
      typeUserReview: isTeacherReview ? GAME_TYPE_TEACHER_REVIEW : GAME_TYPE_USER_REVIEW,
      showAnwserSheet: ![SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING].includes(skillSettingInfo?.skill?.type),
      teacherId: currentUser?._id,
      saveNotAnsweredCardsInTestMode: true,
      saveInPracticeMode: true,
      enablePinAudioPlayer: true,
      ieltsGameSetting: {
        disableWritingDraft: true,
        disableSpeakingDraft: true,
        markSpeakingByParts: true,
        doubleWritingSecondTaskScore: true,
        quizSkillName: skillSettingInfo?.skill?.type === SKILL_TYPE_LISTENING ? 'listening' : (skillSettingInfo?.skill?.type === SKILL_TYPE_READING ? 'reading' : undefined)
      },
      panelId: contentType === TOPIC_CONTENT_TYPE_FILE_PDF ? 'game-file-pdf' : ''
    });

    Promise.all([
      getCardByTopicId(currentTopic._id, skillTypes),
      getSkills()
    ])
      .then(([cards, { data: skills }]) => {
        uiLogic(initGamePageStateAction({
          gameData,
          cards,
          skills,
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
          skills={gameState.skills}
          skillSettingInfo={skillSettingInfo}
          studyScore={studyScore}
          onSubmitted={() => window.history.back()}
          shuffleQuestion={gameState.isShuffleQuestion}
        />
      </>
    )
    : <></>
}

export default GameView;