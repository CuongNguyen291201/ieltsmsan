import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { prepareReviewGameAction } from '../../redux/actions/prepareGame.actions';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { StudyScore } from '../../sub_modules/share/model/studyScore'
import { formatDateDMY, formatTimeClock } from '../../utils';
import { ROUTER_GAME } from '../../utils/router';

const StudyScoreView = (props: { currentTopic: any, studyScore?: StudyScore | null, currentUser: any }) => {
  const { currentTopic, studyScore, currentUser } = props;
  const dispatch = useDispatch();
  const router = useRouter()
  const colorScore = studyScore.studyScoreData.score * 10 < currentTopic.topicExercise.pass ? '#e54851' : '#6F6F6F'

  function playGame() {
    if (currentUser) {
      router.push({
        pathname: ROUTER_GAME,
        query: { id: currentTopic._id }
      })
    }
  }

  return (
    <>
      <div className="section2">
        <div className="section2-left">
          <div className="date-time">
            <div className="date">
              <span>Ngày: </span><span>{formatDateDMY(studyScore.lastUpdate)}</span>
            </div>
            <div className="time">
              <span>Thời gian làm bài : </span><span>{formatTimeClock(studyScore.totalTime)}</span>
            </div>
          </div>
          <div className="score-wrap">
            <div className="score-number" style={{ color: colorScore }}>{studyScore.score}</div>
            <div className="score-text">Điểm</div>
          </div>
          <div className="buttons">
            <div className="xem-lai" onClick={() => {
              if (currentUser) {
                dispatch(prepareReviewGameAction())
                router.push({
                  pathname: ROUTER_GAME,
                  query: { id: currentTopic._id }
                })
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
          <img src={`${studyScore ? (studyScore.pass == 1 ? '/topics/pass_exam.png' : '/topics/failure_exam.png') : '/topics/welcome_exam.png'}`} alt="" />
          <div className="text">{`${studyScore ? (studyScore.pass == 1 ? 'Bạn đã vượt qua bài thi này' : 'Bạn chưa vượt qua bài thi này') : ''}`}</div>
        </div>
      </div>
    </>
  )
}

export default StudyScoreView;
