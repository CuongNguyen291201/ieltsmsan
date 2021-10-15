import { message } from 'antd';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveCourseModalVisibleAction } from '../../redux/actions/course.actions';
import { prepareGoToGameAction, prepareReviewGameAction } from '../../redux/actions/prepareGame.actions';
import { setUserCardDataAction } from '../../redux/actions/topic.action';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { GAME_STATUS_PREPARE_REVIEW } from '../../sub_modules/game/src/gameConfig';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import Topic from '../../sub_modules/share/model/topic';
import { UserInfo } from '../../sub_modules/share/model/user';
import { formatDateDMY, formatTimeClock, getGameSlug } from '../../utils';
import { canPlayTopic } from '../../utils/permission/topic.permission';
import { ROUTER_GAME } from '../../utils/router';

const StudyScoreView = (props: { currentTopic: Topic, studyScore?: StudyScore | null, currentUser: UserInfo }) => {
  const { currentTopic, studyScore, currentUser } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const { isJoinedCourse, currentCourse } = useSelector((state: AppState) => state.courseReducer);
  const colorScore = studyScore.studyScoreData.score * 10 < currentTopic.topicExercise.pass ? '#e54851' : '#6F6F6F';

  function playGame() {
    if (currentUser) {
      if (canPlayTopic({ topic: currentTopic, isJoinedCourse })) {
        router.push(getGameSlug(currentTopic._id));
      } else {
        message.warning('Chưa tham gia khoá học!');
        if (currentCourse.cost) {
          dispatch(setActiveCourseModalVisibleAction(true));
        }
      }
    } else {
      dispatch(showLoginModalAction(true));
    }
  }

  const isPass = ((studyScore.studyScoreData.score / 10) * 100) >= currentTopic?.topicExercise?.pass;

  return (
    <>
      <div className="section2">
        <div className="text-result">
          Kết quả
        </div>
        <div className="">
          {/* <div className="date-time">
            <div className="date">
              <span>Ngày: </span><span>{formatDateDMY(studyScore.lastUpdate)}</span>
            </div>
            <div className="time">
              <span>Thời gian làm bài : </span><span>{formatTimeClock(studyScore.studyScoreData?.totalTime)}</span>
            </div>
          </div> */}
          <div className="img-and-text">
            <img src={`${studyScore ? (isPass ? '/default/good-job.png' : '/topics/failure_exam.png') : '/topics/welcome_exam.png'}`} alt="" />
            <div className="text">{`${studyScore ? (isPass ? 'Bạn đã vượt qua bài thi này' : 'Bạn chưa vượt qua bài thi này') : ''}`}</div>
          </div>
          <div className="score-wrap">
            <div className="score-number">{studyScore.score} / 10 Điểm</div>
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
      </div>
    </>
  )
}

export default StudyScoreView;
