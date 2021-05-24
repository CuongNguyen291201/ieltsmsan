import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { prepareGoToGameAction, prepareReviewGameAction } from '../../redux/actions/prepareGame.actions';
import { setUserCardDataAction } from '../../redux/actions/topic.action';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { GAME_STATUS_PREPARE_REVIEW } from '../../sub_modules/game/src/gameConfig';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import Topic from '../../sub_modules/share/model/topic';
import { UserInfo } from '../../sub_modules/share/model/user';
import { formatDateDMY, formatTimeClock, getGameSlug } from '../../utils';
import { ROUTER_GAME } from '../../utils/router';

const StudyScoreView = (props: { currentTopic: Topic, studyScore?: StudyScore | null, currentUser: UserInfo }) => {
  const { currentTopic, studyScore, currentUser } = props;
  const dispatch = useDispatch();
  const router = useRouter()
  const colorScore = studyScore.studyScoreData.score * 10 < currentTopic.topicExercise.pass ? '#e54851' : '#6F6F6F';

  function playGame() {
    if (currentUser) {
      router.push(getGameSlug(currentTopic._id))
    }
  }

  const isPass = ((studyScore.studyScoreData.score / 10) * 100) >= currentTopic?.topicExercise?.pass;

  return (
    <>
      <div className="section2">
        <div className="section2-left">
          <div className="date-time">
            <div className="date">
              <span>Ngày: </span><span>{formatDateDMY(studyScore.lastUpdate)}</span>
            </div>
            <div className="time">
              <span>Thời gian làm bài : </span><span>{formatTimeClock(studyScore.studyScoreData?.totalTime)}</span>
            </div>
          </div>
          <div className="score-wrap">
            <div className="score-number" style={{ color: colorScore }}>{studyScore.score}</div>
            <div className="score-text">Điểm</div>
          </div>
          <div className="buttons">
            <div className="xem-lai" onClick={() => {
              if (currentUser) {
                dispatch(setUserCardDataAction({ cardData: null, user: null }));
                dispatch(prepareGoToGameAction({ statusGame: GAME_STATUS_PREPARE_REVIEW, studyScore }));
                router.push(getGameSlug(currentTopic._id));
              } else {
                dispatch(showLoginModalAction())
              }
            }}>Xem lại</div>
            {studyScore.studyScoreData.studyTime < currentTopic.topicExercise.replay && (
              <div className="lam-lai" onClick={() => {
                playGame();
              }}> Làm bài</div>
            )}
          </div>
        </div>
        <div className="section2-right">
          <img src={`${studyScore ? (isPass ? '/topics/pass_exam.png' : '/topics/failure_exam.png') : '/topics/welcome_exam.png'}`} alt="" />
          <div className="text">{`${studyScore ? (isPass ? 'Bạn đã vượt qua bài thi này' : 'Bạn chưa vượt qua bài thi này') : ''}`}</div>
        </div>
      </div>
    </>
  )
}

export default StudyScoreView;
