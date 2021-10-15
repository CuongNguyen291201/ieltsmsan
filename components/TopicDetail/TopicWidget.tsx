import { Grid } from '@material-ui/core';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import bookmarkAnswerIcon from '../../public/default/danh-dau.png';
import correctAnswerIcon from '../../public/default/da-thuoc.png';
import incorrectAnswerIcon from '../../public/default/chua-hoc.png';
import notAnswerIcon from '../../public/default/chua-thuoc.png';
import { prepareGoToGameAction } from '../../redux/actions/prepareGame.actions';
import { showToastifyWarning } from '../../sub_modules/common/utils/toastify';
import { GAME_STATUS_PREPARE_REVIEW } from '../../sub_modules/game/src/gameConfig';
import { CARD_BOX_ANSWER_BOOKMARK, CARD_BOX_ANSWER_CORRECT, CARD_BOX_ANSWER_INCORRECT, CARD_BOX_NO_ANSWER, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import MyCardData from '../../sub_modules/share/model/myCardData';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import Topic from '../../sub_modules/share/model/topic';
import { genUnitScore, getGameSlug } from '../../utils';
import { AppState } from '../../redux/reducers';
import { canPlayTopic } from '../../utils/permission/topic.permission';
import { ROUTER_GAME } from '../../utils/router';
import { message } from 'antd';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import CommentPanel from '../CommentPanel';
import { CommentScopes } from '../../custom-types';
import { InformationCourse } from '../CourseDetail/InformationCourse/information-course';
// TOPIC INFO COMMON VIEW
export const TopicInfoCommonView = (props: { currentTopic: any, studyScore?: StudyScore | null, topic?: any }) => {
  const { currentTopic, studyScore, topic } = props;
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { currentCourse } = useSelector((state: AppState) => state.courseReducer);
  const { isJoinedCourse, userCourseLoading } = useSelector((state: AppState) => state.courseReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  let questionsNum = 0;
  let pass = 0;
  let data: { title: string; number: any }[] = [];
  if (currentTopic) {
    questionsNum = currentTopic.topicExercise?.questionsNum ?? 0;
    pass = currentTopic.topicExercise?.pass ?? 0;
    if (currentTopic.type === TOPIC_TYPE_TEST) {
      const duration = currentTopic.topicExercise?.duration ?? 0;
      let pauseTimes: string | number = 0;
      let replay: string | number = 0;
      if (currentTopic.topicExercise) {
        pauseTimes = currentTopic.topicExercise.pauseTimes;
        replay = currentTopic.topicExercise.replay;
      }
      if (studyScore) {
        if (pauseTimes > 0 && studyScore.studyScoreData) {
          pauseTimes = studyScore.studyScoreData.pauseTimeNum + '/' + pauseTimes
        }
        if (replay && studyScore.studyScoreData) {
          replay = studyScore.studyScoreData.studyTime + '/' + replay
        }
      }
      data = [
        { title: 'Tổng số câu hỏi', number: questionsNum },
        { title: 'Điều kiện qua ', number: `${pass}${genUnitScore(currentTopic.topicExercise?.baremScore)}` },
        { title: 'Thời gian làm bài', number: `${duration}p` },
        { title: 'Số lần làm lại', number: replay },
        { title: 'Số lần tạm dừng', number: pauseTimes },
      ]
    } else {
      data = [
        { title: 'Tổng số câu hỏi', number: questionsNum },
        { title: 'Số câu ở mỗi lần luyện tập', number: currentTopic.topicExercise?.questionsPlayNum ?? 0 }
      ]
    }
  }
  function playGame() {
    if (currentUser && !userCourseLoading) {
      if (canPlayTopic({ topic, isJoinedCourse })) {
        // if (isPermissionPlayGame(currentUserUpdate, category)) {
        router.push({
          pathname: ROUTER_GAME,
          query: { id: currentTopic._id }
        })
      } else {
        message.warning("Chưa tham gia khoá học!");
      }
      // } else {
      // showToastifyWarning('Bạn hết thời gian học thử, vui lòng mua khoá học để học tiếp')
      // }
    } else {
      dispatch(showLoginModalAction(true))
    }
  }
  return (
    <div className="view-section1">
      <Grid container>
        <Grid item md={8} className="section1">
          <div className="title">Thông tin Chung</div>
          <div className={`${currentTopic?.type != TOPIC_TYPE_TEST ? 'list-exercise' : ""} list`}>
            {data.map((e, index) => {
              return (
                <div className="list-item" key={index}>
                  <div className="text">{e.title}</div>
                  <div className="number">{e.number}</div>
                </div>
              )
            })}
          </div>
          <div className="start-game__">
            <div className="pre-game-start" onClick={playGame}>
              <div className="start-game-btn">
                Làm bài
              </div>
            </div>
          </div>
        </Grid>
        <Grid item className="comment__" md={4}>
          <CommentPanel commentScope={CommentScopes.TOPIC} />
        </Grid>
      </Grid>
      <Grid container className="information-in-course">
        <Grid item md={8}> </Grid>
        <Grid item md={4}>
          <InformationCourse course={currentCourse} />
        </Grid>
      </Grid>
    </div>
  )
}


// MY CARD DATA VIEW
function getNumCardBox(myCardData: MyCardData, currentTopic: Topic) {
  let cardCorrectArr: string[] = [];
  let cardIncorrectArr: string[] = [];
  let numCardNotAnswer = 0;
  let cardBookMark: string[] = []
  if (currentTopic?.topicExercise) {
    numCardNotAnswer = currentTopic.topicExercise.questionsNum;
  }
  if (myCardData) {
    const mapBoxNum: { [x: number]: string[] } = {};
    Object.keys(myCardData.boxCard).map((e: string) => {
      const boxNum = myCardData.boxCard[e] > 0 ? 1 : 0;
      mapBoxNum[boxNum] = [...mapBoxNum[boxNum] || [], e];
    });
    cardCorrectArr = mapBoxNum[1] ? mapBoxNum[1] : [];
    cardIncorrectArr = mapBoxNum[0] ? mapBoxNum[0] : [];
    numCardNotAnswer = numCardNotAnswer - cardCorrectArr.length - cardIncorrectArr.length;
    if (numCardNotAnswer < 0) {
      numCardNotAnswer = 0;
    }
    cardBookMark = myCardData.cardBookmarks ?? [];
  }
  return { cardCorrectArr, cardIncorrectArr, numCardNotAnswer, cardBookMark }
}

export const MyCardDataView = (props: { currentTopic: Topic; studyScore?: StudyScore | null, myCardData: MyCardData }) => {
  const { currentTopic, studyScore, myCardData } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const { cardCorrectArr, cardIncorrectArr, numCardNotAnswer, cardBookMark } = getNumCardBox(myCardData, currentTopic);

  const onClick = (box: number) => {
    dispatch(prepareGoToGameAction({ statusGame: GAME_STATUS_PREPARE_REVIEW, studyScore, boxGame: box }));
    router.push(getGameSlug(currentTopic._id));
  }

  return (
    <>
      {
        myCardData && <Grid md={12} className="section3">
          <div className="tien-do-hoc">Tiến Độ Học</div>
          <Grid md={8} className="cardDataBoxViewPanel">
            <CardDataBoxView
              text="Chưa học"
              numCard={cardIncorrectArr.length}
              url={incorrectAnswerIcon}
              onClick={() => {
                if (cardIncorrectArr.length) {
                  onClick(CARD_BOX_ANSWER_INCORRECT)
                } else {
                  showToastifyWarning('Không có câu trả lời sai hiển thị')
                }
              }}
            />

            <CardDataBoxView
              text="Chưa thuộc"
              numCard={numCardNotAnswer}
              url={notAnswerIcon}
              onClick={() => {
                if (numCardNotAnswer) {
                  onClick(CARD_BOX_NO_ANSWER)
                } else {
                  showToastifyWarning('Không có câu chưa trả lời hiển thị')
                }
              }}
            />

            <CardDataBoxView
              text="Đã thuộc"
              numCard={cardCorrectArr.length}
              url={correctAnswerIcon}
              onClick={() => {
                if (cardCorrectArr.length) {
                  onClick(CARD_BOX_ANSWER_CORRECT)
                } else {
                  showToastifyWarning('Không có câu trả lời đúng hiển thị')
                }
              }}
            />

            <CardDataBoxView
              text="Đánh dấu"
              numCard={cardBookMark.length}
              url={bookmarkAnswerIcon}
              onClick={() => {
                if (cardBookMark.length) {
                  onClick(CARD_BOX_ANSWER_BOOKMARK)
                } else {
                  showToastifyWarning('Không có câu cân nhắc hiển thị')
                }
              }}
            />
          </Grid>
        </Grid>

      }
    </>
  )
}

// MY CARD BOX

const CardDataBoxSkeleton = () => (
  <>
    <Grid md={5} className="section3-box">
      <div className="head"><Skeleton /></div>
      <div className="content">
        <div className="image skeleton">
          <Skeleton />
        </div>
        <div className="sentence-wrap">
          <div className="sentence-number skeleton"><Skeleton /></div>
          <div className="sentence-text skeleton"><Skeleton /></div>
        </div>
      </div>
    </Grid>
  </>
)

const CardDataBoxView = (props: { text: string; numCard: number; url: string; onClick: () => any }) => (
  <>
    <Grid md={5} className="section3-box"
      onClick={() => props.onClick()}
    >
      <div className="content">
        <div className="image">
          <img src={props.url} alt="" />
        </div>
        <div className="sentence-number">{props.numCard}</div>
      </div>
      <div className="head_">{props.text}</div>
    </Grid>
  </>
);

export const MyCardDataSkeleton = () => (
  <Grid className="section3">
    <CardDataBoxSkeleton />
    <CardDataBoxSkeleton />
    <CardDataBoxSkeleton />
    <CardDataBoxSkeleton />
  </Grid>
);

// STATIC SKILL
export const StatisticSkillSkeleton = () => <Skeleton height={200} />
