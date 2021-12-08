import { createStyles, Grid, Theme, withStyles } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useRouter } from 'next/router';
import { useSnackbar } from "notistack";
import React, { Fragment, useCallback } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import incorrectAnswerIcon from '../../public/images/icons/chua-hoc.png';
import notAnswerIcon from '../../public/images/icons/chua-thuoc.png';
import correctAnswerIcon from '../../public/images/icons/da-thuoc.png';
import bookmarkAnswerIcon from '../../public/images/icons/danh-dau.png';
import { setActiveCourseModalVisibleAction } from '../../redux/actions/course.actions';
import { prepareGoToGameAction } from '../../redux/actions/prepareGame.actions';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { showToastifyWarning } from '../../sub_modules/common/utils/toastify';
import { GAME_STATUS_PREPARE_PLAY, GAME_STATUS_PREPARE_REVIEW } from '../../sub_modules/game/src/gameConfig';
import { CARD_BOX_ANSWER_BOOKMARK, CARD_BOX_ANSWER_CORRECT, CARD_BOX_ANSWER_INCORRECT, CARD_BOX_NO_ANSWER, TOPIC_TYPE_TEST } from '../../sub_modules/share/constraint';
import MyCardData from '../../sub_modules/share/model/myCardData';
import { StudyScore } from '../../sub_modules/share/model/studyScore';
import Topic from '../../sub_modules/share/model/topic';
import { UserInfo } from '../../sub_modules/share/model/user';
import { genUnitScore, getGameSlug } from '../../utils';
import { canPlayTopic } from '../../utils/permission/topic.permission';
import { ROUTER_GAME } from '../../utils/router';

// TOPIC INFO COMMON VIEW
export const TopicInfoCommonView = (props: { currentTopic: Topic, studyScore?: StudyScore | null; hidePlayGameButton?: boolean; hideCourseInfo?: boolean }) => {
  const { currentTopic, studyScore, hidePlayGameButton } = props;
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { currentCourse } = useSelector((state: AppState) => state.courseReducer);
  const { isJoinedCourse, userCourseLoading } = useSelector((state: AppState) => state.courseReducer);
  const { enqueueSnackbar } = useSnackbar();
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
        { title: 'Tổng số câu hỏi', number: `${questionsNum} câu` },
        { title: `Điều kiện qua (điểm)`, number: `${pass} điểm` },
        { title: 'Thời gian làm bài', number: `${duration} phút` },
        { title: 'Số lần làm lại', number: replay },
        { title: 'Số lần tạm dừng', number: pauseTimes },
      ]
    } else {
      data = [
        { title: 'Tổng số câu hỏi', number: `${questionsNum} câu` },
        { title: 'Số câu ở mỗi lần luyện tập', number: `${currentTopic.topicExercise?.questionsPlayNum} câu` ?? 0 },
        { title: 'Điều kiện qua (%)', number: `${currentTopic.topicExercise?.pass} %` }
      ]
    }
  }
  function playGame() {
    if (currentUser && !userCourseLoading) {
      if (canPlayTopic({ topic: currentTopic, isJoinedCourse })) {
        // if (isPermissionPlayGame(currentUserUpdate, category)) {
        router.push({
          pathname: ROUTER_GAME,
          query: { id: currentTopic._id }
        })
      } else {
        enqueueSnackbar("Chưa tham gia khoá học!", { variant: "warning" });
        if (currentCourse.cost > 0) {
          dispatch(setActiveCourseModalVisibleAction(true));
        }
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
      <div className="section1">
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
        {!hidePlayGameButton && <div className="start-game__">
          <div className="pre-game-start" onClick={playGame}>
            <div className="start-game-btn">
              Làm bài
            </div>
          </div>
        </div>}
      </div>
      {/* <Grid item className="comment__" md={4}>
          <CommentPanel commentScope={CommentScopes.TOPIC} />
        </Grid> */}
      {/* {!hideCourseInfo && <Grid container className="information-in-course">
        <Grid item md={8}> </Grid>
        <Grid item md={4}>
          <InformationCourse course={currentCourse} />
        </Grid>
      </Grid>} */}
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

export const MyCardDataView = (props: { currentTopic: Topic; studyScore?: StudyScore | null, myCardData: MyCardData; user?: UserInfo; isJoinedCourse?: boolean }) => {
  const { currentTopic, studyScore, myCardData, user, isJoinedCourse } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const { cardCorrectArr, cardIncorrectArr, numCardNotAnswer, cardBookMark } = getNumCardBox(myCardData, currentTopic);

  const onClickBox = (box: number, numCard: number) => {
    if (!user) {
      dispatch(showLoginModalAction(true));
      return;
    }
    if (numCard === 0) {
      showToastifyWarning("Không có câu hỏi!");
      return;
    }
    dispatch(prepareGoToGameAction({ statusGame: GAME_STATUS_PREPARE_REVIEW, studyScore, boxGame: box }));
    router.push(getGameSlug(currentTopic._id));
  }

  const playGame = useCallback(() => {
    if (!user) {
      dispatch(showLoginModalAction(true));
      return;
    }
    if (!canPlayTopic({ topic: currentTopic, isJoinedCourse })) {
      showToastifyWarning("Chưa tham gia khoá học");
      return;
    }
    dispatch(prepareGoToGameAction({ statusGame: GAME_STATUS_PREPARE_PLAY }));
    router.push(getGameSlug(currentTopic._id));
  }, [user, isJoinedCourse]);

  const review = useCallback(() => {
    if (!!user) {
      dispatch(prepareGoToGameAction({ statusGame: GAME_STATUS_PREPARE_REVIEW, studyScore }));
      router.push(getGameSlug(currentTopic._id));
    }
  }, [user])

  const mapBoxLabel = {
    [CARD_BOX_ANSWER_INCORRECT]: {
      label: "Chưa thuộc",
      icon: incorrectAnswerIcon,
      numCard: cardIncorrectArr.length
    },
    [CARD_BOX_ANSWER_CORRECT]: {
      label: "Đã thuộc",
      icon: correctAnswerIcon,
      numCard: cardCorrectArr.length
    },
    [CARD_BOX_ANSWER_BOOKMARK]: {
      label: "Đánh dấu",
      icon: bookmarkAnswerIcon,
      numCard: cardBookMark.length
    },
    [CARD_BOX_NO_ANSWER]: {
      label: "Chưa học",
      icon: notAnswerIcon,
      numCard: numCardNotAnswer
    }
  }

  const BorderLinearProgress = withStyles((theme: Theme) =>
    createStyles({
      root: {
        height: 30,
        borderRadius: 0,
      },
      colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
      },
      bar: {
        borderRadius: 0,
        backgroundColor: '#26C048',
      },
    }),
  )(LinearProgress);
  return (
    <div className="section3">
      <div className="tien-do-hoc">Tiến Độ Học</div>
      <div className="progress-animation">
        <BorderLinearProgress variant="determinate" value={studyScore?.progress || 0} />
        <div className="item-progress-ani" style={{ left: `${(studyScore?.progress || 0) - 4}%` }} >{studyScore?.progress || 0}%</div>
        <div style={{ left: `${(studyScore?.progress || 0) - 1.5}%` }} id="triangle-down"></div>
      </div>
      <Grid container className="cardDataBoxViewPanel">
        {[CARD_BOX_NO_ANSWER, CARD_BOX_ANSWER_INCORRECT, CARD_BOX_ANSWER_CORRECT, CARD_BOX_ANSWER_BOOKMARK].map((box, key) => (
          <Grid key={key} item xs={12} sm={6}>
            <CardDataBoxView
              text={mapBoxLabel[box].label}
              numCard={mapBoxLabel[box].numCard}
              url={mapBoxLabel[box].icon}
              onClick={() => { onClickBox(box, mapBoxLabel[box].numCard) }}
            />
          </Grid>
        ))}
      </Grid>
      <div className="topic-button-group">
        <div className="topic-button topic-button-play" onClick={playGame}>Làm bài</div>
        {!!studyScore && <div className="topic-button topic-button-review" onClick={review}>Xem lại</div>}
      </div>
    </div>
  )
}

// MY CARD BOX

const CardDataBoxView = (props: { text: string; numCard: number; url: string; onClick: () => any }) => (
  <div className="section3-box"
    onClick={() => props.onClick()}
  >
    <div className="content">
      <div className="image">
        <img src={props.url} alt="" />
      </div>
      <div className="sentence-number">{props.numCard}</div>
    </div>
    <div className="head_">{props.text}</div>
  </div>
);

// STATIC SKILL
export const StatisticSkillSkeleton = () => <Skeleton height={200} />
