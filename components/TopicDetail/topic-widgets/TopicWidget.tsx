import { Box, Button, Grid, MenuItem, Select, Theme } from '@mui/material';
import { SxProps } from "@mui/system";
import classNames from "classnames";
import { useRouter } from 'next/router';
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { MapCardStudyOrderLabel } from "../../../custom-types/MapContraint";
import { setExerciseOptionsAction } from "../../../redux/actions/exam.action";
import { prepareGoToGameAction } from '../../../redux/actions/prepareGame.actions';
import { AppState } from '../../../redux/reducers';
import { showLoginModalAction } from '../../../sub_modules/common/redux/actions/userActions';
import { showToastifyWarning } from '../../../sub_modules/common/utils/toastify';
import { GAME_STATUS_PREPARE_PLAY, GAME_STATUS_PREPARE_REVIEW } from '../../../sub_modules/game/src/gameConfig';
import { CARD_BOX_ANSWER_BOOKMARK, CARD_BOX_ANSWER_CORRECT, CARD_BOX_ANSWER_INCORRECT, CARD_BOX_NO_ANSWER, CARD_STUDY_ORDER_CORRECT, CARD_STUDY_ORDER_DEFAULT, CARD_STUDY_ORDER_INCORRECT, CARD_STUDY_ORDER_NONE, TOPIC_CONTENT_TYPE_FLASH_CARD, TOPIC_TYPE_TEST } from '../../../sub_modules/share/constraint';
import MyCardData from '../../../sub_modules/share/model/myCardData';
import { StudyScore } from '../../../sub_modules/share/model/studyScore';
import Topic from '../../../sub_modules/share/model/topic';
import { UserInfo } from '../../../sub_modules/share/model/user';
import { getGameSlug } from '../../../utils';
import { canPlayTopic } from '../../../utils/permission/topic.permission';
import { ROUTER_GAME } from '../../../utils/router';
import notAnswerIcon from '../../../public/images/icons/chua-hoc.png';
import incorrectAnswerIcon from '../../../public/images/icons/chua-thuoc.png';
import correctAnswerIcon from '../../../public/images/icons/da-thuoc.png';
import bookmarkAnswerIcon from '../../../public/images/icons/danh-dau.png';
import StaticLabelSlider from "../../StaticLabelSlider";
import useTopicWidgetStyles from "./useTopicWidgetStyles";
// TOPIC INFO COMMON VIEW
export const TopicInfoCommonView = (props: { currentTopic: Topic, studyScore?: StudyScore | null; hidePlayGameButton?: boolean; }) => {
  const { currentTopic, studyScore, hidePlayGameButton } = props;
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const examReducer = useSelector((state: AppState) => state.examReducer);
  const { currentCourse } = useSelector((state: AppState) => state.courseReducer);
  const { isJoinedCourse, userCourseLoading } = useSelector((state: AppState) => state.courseReducer);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useTopicWidgetStyles();
  const dispatch = useDispatch();
  const router = useRouter();
  const topicData = useMemo(() => {
    const questionsNum = currentTopic?.topicExercise?.questionsNum ?? 0;
    const pass = currentTopic?.topicExercise?.pass ?? 0;
    const duration = currentTopic.topicExercise?.duration ?? 0;
    const data: Array<{
      title: string;
      number?: string | number;
      options?: Array<{ value: string | number, label: string }>;
      onChange?: (value: string | number) => void;
      initOption?: () => void;
      optionKey?: string;
    }> = [];
    if (currentTopic.type === TOPIC_TYPE_TEST) {
      data.push(
        { title: "Tổng số câu hỏi", number: `${questionsNum} câu` },
        { title: "Điều kiện qua (điểm)", number: `${pass} điểm` },
        { title: "Thời gian làm bài", number: `${duration} phút` },
        { title: "Số lần làm lại", number: `${studyScore?.studyScoreData?.pauseTimeNum ?? 0} / ${currentTopic?.topicExercise?.pauseTimes ?? 0}` },
        { title: "Số lần tạm dừng", number: `${studyScore?.studyScoreData?.studyTime ?? 0} / ${currentTopic?.topicExercise?.replay ?? 0}` },
      );
    } else {
      if (currentTopic?.topicExercise?.contentType === TOPIC_CONTENT_TYPE_FLASH_CARD) {
        const skip = Math.ceil(questionsNum / 10);
        const questionsPlayNumOptions = questionsNum < 10 ? [questionsNum] : new Array(skip).fill(0).map((_, i) => {
          return i !== skip - 1 ? (i + 1) * 10 : questionsNum
        })
        data.push(
          { title: "Tổng số từ", number: `${questionsNum} từ` },
          {
            title: "Học",
            options: questionsPlayNumOptions.map((value) => ({ value, label: `${value} từ` })),
            onChange: (value: number) => {
              dispatch(setExerciseOptionsAction({ target: "questionsPlayNum", value }))
            },
            initOption: () => {
              dispatch(setExerciseOptionsAction({ target: "questionsPlayNum", value: questionsNum }))
            },
            optionKey: "questionsPlayNum"
          },
          {
            title: "Ưu tiên",
            options: [
              { value: CARD_STUDY_ORDER_DEFAULT, label: MapCardStudyOrderLabel[CARD_STUDY_ORDER_DEFAULT] },
              { value: CARD_STUDY_ORDER_CORRECT, label: MapCardStudyOrderLabel[CARD_STUDY_ORDER_CORRECT] },
              { value: CARD_STUDY_ORDER_INCORRECT, label: MapCardStudyOrderLabel[CARD_STUDY_ORDER_INCORRECT] },
              { value: CARD_STUDY_ORDER_NONE, label: MapCardStudyOrderLabel[CARD_STUDY_ORDER_NONE] },
            ],
            onChange: (value: number) => {
              dispatch(setExerciseOptionsAction({ target: "cardStudyOrder", value }))
            },
            initOption: () => {
              dispatch(setExerciseOptionsAction({ target: "cardStudyOrder", value: CARD_STUDY_ORDER_DEFAULT }))
            },
            optionKey: "cardStudyOrder"
          }
        )
      } else {
        data.push(
          { title: 'Tổng số câu hỏi', number: `${questionsNum} câu` },
          { title: 'Số câu ở mỗi lần luyện tập', number: `${currentTopic.topicExercise?.questionsPlayNum} câu` ?? 0 },
          { title: 'Điều kiện qua (%)', number: `${currentTopic.topicExercise?.pass} %` }
        )
      }
    }
    return data;
  }, [currentTopic, studyScore]);

  useEffect(() => {
    topicData.forEach(({ initOption }) => {
      if (typeof initOption !== 'undefined') {
        initOption();
      }
    })
  }, [topicData]);

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
      }
      // } else {
      // showToastifyWarning('Bạn hết thời gian học thử, vui lòng mua khoá học để học tiếp')
      // }
    } else {
      dispatch(showLoginModalAction(true))
    }
  }

  return (
    <div className="topic-info-common-view">
      <Box textAlign="center"><h2>Thông tin Chung</h2></Box>
      <div className={`${currentTopic?.type != TOPIC_TYPE_TEST ? 'list-exercise' : ""} list`}>
        {topicData.map((e, index) => {
          const isChoice = typeof e.options !== 'undefined';
          return (
            <Box className={classes.topicOverviewItem} key={index}>
              <Box className={classes.topicOverviewLabel}>{e.title}</Box>
              {isChoice
                ? <>
                  <Select className={classes.topicDataSelect} value={examReducer[e.optionKey]} onChange={(evt) => {
                    dispatch(setExerciseOptionsAction({ target: e.optionKey, value: Number(evt.target.value) }))
                  }}>
                    {(e.options ?? []).map(({ value, label }) => (
                      <MenuItem
                        sx={{ fontFamily: "inherit", fontWeight: 500, fontSize: "14px" }}
                        key={value}
                        value={value}>{label}</MenuItem>
                    ))}
                  </Select>
                </>
                : <Box className={classes.topicOverviewValue}>{e.number}</Box>}
            </Box>
          )
        })}
      </div>
      {!hidePlayGameButton && <div className="start-game__">
        <Box display="flex" justifyContent="center" mt="16px">
          <Button className={classNames(classes.gameButton, classes.gameButtonPlay)} onClick={playGame}>
            <div className="start-game-btn">
              Làm bài
            </div>
          </Button>
        </Box>
      </div>}
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

export const MyCardDataView = (props: {
  currentTopic: Topic; studyScore?: StudyScore | null, myCardData: MyCardData; user?: UserInfo; isJoinedCourse?: boolean;
  sliderBoxStyle?: SxProps<Theme>
  cardDataBoxStyle?: SxProps<Theme>
  gameButtonGroupBoxStyle?: SxProps<Theme>
}) => {
  const { currentTopic, studyScore, myCardData, user, isJoinedCourse, sliderBoxStyle, cardDataBoxStyle, gameButtonGroupBoxStyle } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const classes = useTopicWidgetStyles();
  const { cardCorrectArr, cardIncorrectArr, numCardNotAnswer, cardBookMark } = getNumCardBox(myCardData, currentTopic);
  const { gamePlayButtonLabel, gameReviewButtonLabel, isFlashCard } = useMemo(() => {
    const isFlashCard = currentTopic?.topicExercise?.contentType === TOPIC_CONTENT_TYPE_FLASH_CARD;
    return {
      gamePlayButtonLabel: isFlashCard ? 'Học ngay' : 'Làm bài',
      gameReviewButtonLabel: isFlashCard ? 'Chơi game' : 'Xem lại',
      isFlashCard
    }
  }, [currentTopic])

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
    if (!user) {
      dispatch(showLoginModalAction(true));
      return;
    }
    if (!canPlayTopic({ topic: currentTopic, isJoinedCourse })) {
      showToastifyWarning("Chưa tham gia khoá học");
      return;
    }
    if (!!user) {
      dispatch(prepareGoToGameAction({ statusGame: GAME_STATUS_PREPARE_REVIEW, studyScore }));
      router.push(getGameSlug(currentTopic._id));
    }
  }, [user, isJoinedCourse])

  const mapBoxLabel = {
    [CARD_BOX_ANSWER_INCORRECT]: {
      label: "Chưa thuộc",
      icon: incorrectAnswerIcon,
      numCard: cardIncorrectArr.length,
      color: "#FF8474"
    },
    [CARD_BOX_ANSWER_CORRECT]: {
      label: "Đã thuộc",
      icon: correctAnswerIcon,
      numCard: cardCorrectArr.length,
      color: "#2DC27C"
    },
    [CARD_BOX_ANSWER_BOOKMARK]: {
      label: "Đánh dấu",
      icon: bookmarkAnswerIcon,
      numCard: cardBookMark.length,
      color: "#02C2E8"
    },
    [CARD_BOX_NO_ANSWER]: {
      label: "Chưa học",
      icon: notAnswerIcon,
      numCard: numCardNotAnswer,
      color: "#FFBE40"
    }
  }

  return (
    <div className="my-card-data-view">
      <Box className="tien-do-hoc" sx={{ textAlign: "center" }}><h2>Tiến Độ Học</h2></Box>
      <Box className="progress-animation" mt="40px" mb="40px" sx={{ ...sliderBoxStyle }}>
        <StaticLabelSlider
          min={0} max={100} value={studyScore?.progress ?? 0}
          height="25px"
          valueLabelTopPosition="-16px"
          valueLabelFormat={(value) => <>{value}%</>}
        />
      </Box>
      <Grid container className="cardDataBoxViewPanel" rowGap="28px" sx={{ ...cardDataBoxStyle }}>
        {[CARD_BOX_NO_ANSWER, CARD_BOX_ANSWER_INCORRECT, CARD_BOX_ANSWER_CORRECT, CARD_BOX_ANSWER_BOOKMARK].map((box, key) => (
          <Grid key={key} item xs={12} sm={6}
            sx={{
              display: "flex",
              justifyContent: {
                xs: "center",
                sm: (key % 2) ? "end" : "start"
              }
            }}
          >
            <CardDataBoxView
              text={mapBoxLabel[box].label}
              numCard={mapBoxLabel[box].numCard}
              url={mapBoxLabel[box].icon}
              onClick={() => { onClickBox(box, mapBoxLabel[box].numCard) }}
              color={mapBoxLabel[box].color}
            />
          </Grid>
        ))}
      </Grid>
      <Box className="topic-button-group" sx={{
        display: "flex",
        gap: "50px",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "40px",
        flexDirection: {
          xs: "column",
          md: "row"
        },
        ...gameButtonGroupBoxStyle
      }}>
        <Button
          className={classNames(classes.gameButton, classes.gameButtonPlay)}
          onClick={playGame}
        >{gamePlayButtonLabel}
        </Button>
        {(!!studyScore || isFlashCard) &&
          <Button className={classNames(classes.gameButton, classes.gameButtonReview)} onClick={review}>{gameReviewButtonLabel}</Button>
        }
      </Box>
    </div>
  )
}

// MY CARD BOX

const CardDataBoxView = (props: { text: string; numCard: number; url: string; onClick: () => any, color?: string; }) => (
  <Box component="div" onClick={props.onClick} sx={{
    display: "flex",
    flexDirection: "column",
    width: "190px",
    height: "135px",
    boxShadow: "inset 0px 2px 8px rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    cursor: "pointer"
  }}>
    <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: "32px",
      flex: 1
    }}>
      <Box>
        <img src={props.url} alt={props.text} />
      </Box>
      <Box sx={{
        color: props.color || "#000",
        fontSize: "30px",
        fontWeight: 700
      }}>{props.numCard}</Box>
    </Box>
    <Box sx={{
      background: "#EFF3FC",
      boxShadow: "inset 0px 2px 5px rgba(0, 0, 0, 0.1)",
      width: "100%",
      height: "28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 600
    }}>{props.text}</Box>
  </Box>
);

// STATIC SKILL
export const StatisticSkillSkeleton = () => <Skeleton height={200} />
