import dynamic from 'next/dynamic';
import { Router, useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { AppState } from '../../redux/reducers';
import { GAME_STATUS_PLAYING } from '../../sub_modules/game/src/gameConfig';
import LoadingGame from '../../sub_modules/game/src/game_components/loadingGame';
import './style.scss';

const GameView = dynamic(
  () => import('../../components/GameView'),
  { ssr: false, loading: () => <LoadingGame /> }
);

const GamePage = () => {
  const { currentTopic, myCardData: userCardData, userToReview, reviewCardData } = useSelector((state: AppState) => state.topicReducer);
  const { boxGame, studyScore, skillSettingInfo, userIdReview, userNameReview } = useSelector((state: AppState) => state.prepareGameReducer);
  const { statusGame } = useSelector((state: AppState) => state.prepareGameReducer);
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
      />
    </div>
  </Layout>
}

export default GamePage
