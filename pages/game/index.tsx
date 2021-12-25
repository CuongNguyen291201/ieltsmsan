import dynamic from 'next/dynamic';
import { Router, useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { AppState } from '../../redux/reducers';
import { GAME_STATUS_PLAYING } from '../../sub_modules/game/src/gameConfig';
import LoadingGame from '../../sub_modules/game/src/game_components/loadingGame';
import { TOPIC_CONTENT_TYPE_FLASH_CARD } from "../../sub_modules/share/constraint";
import './style.scss';

const GameView = dynamic(
  () => import('../../components/GameView'),
  { ssr: false, loading: () => <LoadingGame /> }
);

const GamePage = () => {
  const { currentTopic, myCardData: userCardData, userToReview, reviewCardData, studyScore } = useSelector((state: AppState) => state.topicReducer);
  const { boxGame, skillSettingInfo, userIdReview, userNameReview } = useSelector((state: AppState) => state.prepareGameReducer);
  const { statusGame } = useSelector((state: AppState) => state.prepareGameReducer);
  const { currentUser: user } = useSelector((state: AppState) => state.userReducer)
  const { modeShowResultImmediately } = useSelector((state: AppState) => state.gameReducer);
  const mapSkillTypeValues = useSelector((state: AppState) => state.examReducer.mapSkillTypeValues);
  const questionsPlayNum = useSelector((state: AppState) => state.examReducer.questionsPlayNum);
  const cardStudyOrder = useSelector((state: AppState) => state.examReducer.cardStudyOrder);
  const topicContentType = currentTopic?.topicExercise?.contentType;
  const topicQuestionsNum = currentTopic?.topicExercise?.questionsNum;
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
  return <Layout addMathJax={true} hideMenu hideFooter>
    <div>
      <GameView
        currentTopic={currentTopic}
        currentUser={currentUser}
        modeShowResultImmediately={modeShowResultImmediately}
        statusGame={statusGame}
        boxGame={boxGame}
        myCardData={myCardData}
        skillSettingInfo={skillSettingInfo}
        studyScore={studyScore}
        userIdReview={userIdReview}
        userNameReview={userNameReview}
        mapSkillTypeValues={mapSkillTypeValues}
        questionsPlayNum={topicContentType === TOPIC_CONTENT_TYPE_FLASH_CARD ? (questionsPlayNum || topicQuestionsNum) : topicQuestionsNum}
        cardStudyOrder={cardStudyOrder}
      />
    </div>
  </Layout>
}

export default GamePage
