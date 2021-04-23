import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { prepareReviewGameAction } from '../../redux/actions/prepareGame.actions';
import { AppState } from '../../redux/reducers';
import { getCookie, MODE_SHOW_RESULT_EXERCISE } from '../../sub_modules/common/utils/cookie';
import * as Config from '../../sub_modules/share/constraint';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import { UserInfo } from '../../sub_modules/share/model/user';
import { formatDateDMY, formatTimeClock } from '../../utils';
import { ROUTER_GAME } from '../../utils/router';
import './topic-content.scss';
import { MyCardDataView, TopicInfoCommonView } from './TopicWidget';

const ExerciseView = (props: { currentTopic: any; studyScore?: StudyScore | null; currentUser: any }) => {
  const { currentTopic, studyScore, currentUser } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  function playGame() {
    if (currentUser) {
      router.push({
        pathname: ROUTER_GAME,
        query: { id: currentTopic._id }
      })
    }
  }

  function review() {
    if (currentUser) {
      dispatch(prepareReviewGameAction())
      router.push({
        pathname: ROUTER_GAME,
        query: { id: currentTopic._id }
      })
    }
  }

  const dataOption = [{ key: Config.GAME_SHOW_RESULT_IMMEDIATELY, value: 'Hiện kết quả ngay' }, { key: Config.GAME_SHOW_RESULT_AFTER, value: 'Hiện kết quả sau' }]
  const showResultImmediately = getCookie(MODE_SHOW_RESULT_EXERCISE) || Config.GAME_SHOW_RESULT_IMMEDIATELY;
  let defaultOption: { key: number; value: string };
  dataOption.forEach(e => {
    if (e.key == showResultImmediately) {
      defaultOption = e
    }
  });

  return (
    <div className="section-result-exercise">
      <div className="date-time">
        <div className="date">
          <span>Ngày </span><div>:</div><span>{formatDateDMY(studyScore.lastUpdate)}</span>
        </div>
        <div className="time">
          <span>Thời gian làm bài</span><div>:</div> <span>{formatTimeClock(studyScore.totalTime)}</span>
        </div>
      </div>
      <div className="score-wrap">
        <div className="score-number">{studyScore.progress}</div>
        <div className="score-text">%</div>
      </div>
      <div className="button-list">
        <div className="flex" style={{ display: 'flex' }}>
          <div className="xem-lai" onClick={() => review()}>Xem lại</div>
          <div className="lam-lai" onClick={() => playGame()}>Làm bài</div>
        </div>
      </div>

    </div>
  )
}

const ExerciseSkeleton = () => (
  <div className="section-result-exercise">
    <div className="date-time">
      <div className="date skeleton">
        <span><Skeleton /></span>
      </div>
      <div className="date skeleton">
        <span><Skeleton /></span>
      </div>
    </div>
    <div className="score-wrap">
      <div className="score-number"><Skeleton width={100} /></div>
      <div className="score-text"><Skeleton width={40} /></div>
    </div>
    <div className="flex ">
      <div className="flex select-mode-study">
        <span><Skeleton width={100} /></span>
        <span><Skeleton width={100} /></span>
      </div>
    </div>

  </div>
);

const NoExerciseView = (props: { currentTopic: any, currentUser: any }) => {
  const { currentTopic, currentUser } = props;
  const router = useRouter()
  function playGame() {
    if (currentUser) {
      router.push({
        pathname: ROUTER_GAME,
        query: { id: currentTopic._id }
      })
    }
  }

  return (
    <div className="section2-no-exam">
      <div className="date">
        <span>Ngày: </span><span>{formatDateDMY(Date.now())}</span>
      </div>
      <img src={`/topics/welcome_exam.png`} alt="" />
      <div className="button-list">
        <div className="flex" style={{ justifyContent: 'center' }}>
          <div className="lam-lai" onClick={() => {
            playGame()
          }}>Làm bài</div>
        </div>
      </div>

    </div>
  )
}

export const TestScoreView = (props: { studyScore: StudyScore, myCardData: any, currentTopic: any, currentUser: UserInfo }) => {
  let { studyScore, myCardData, currentTopic, currentUser } = props
  return <>
    <TopicInfoCommonView currentTopic={currentTopic} studyScore={studyScore} />
    {studyScore ?
      <ExerciseView currentTopic={currentTopic} studyScore={studyScore} currentUser={currentUser} /> :
      <NoExerciseView currentTopic={currentTopic} currentUser={currentUser} />}
  </>
}

const ExerciseInfoView = (props: { topic: any }) => {
  const { topic } = props;
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { studyScore, myCardData } = useSelector((state: AppState) => state.topicReducer);

  return (
    <div className="topic-test-view">
      <TopicInfoCommonView currentTopic={topic} studyScore={studyScore} />
      <>
        <ExerciseView currentTopic={topic} studyScore={studyScore} currentUser={currentUser} />
        <MyCardDataView currentTopic={topic} studyScore={studyScore} myCardData={myCardData} />
      </>
    </div>
  );
};

export default ExerciseInfoView;