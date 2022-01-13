import { Box, Button, Grid, Theme } from '@mui/material';
import { SxProps } from "@mui/system";
import classNames from "classnames";
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDispatch } from 'react-redux';
import notAnswerIcon from '../../../public/images/icons/chua-hoc.png';
import incorrectAnswerIcon from '../../../public/images/icons/chua-thuoc.png';
import correctAnswerIcon from '../../../public/images/icons/da-thuoc.png';
import bookmarkAnswerIcon from '../../../public/images/icons/danh-dau.png';
import { setExerciseOptionsAction } from "../../../redux/actions/exam.action";
import { prepareGoToGameAction } from '../../../redux/actions/prepareGame.actions';
import { showLoginModalAction } from '../../../sub_modules/common/redux/actions/userActions';
import { showToastifyWarning } from '../../../sub_modules/common/utils/toastify';
import { GAME_STATUS_PREPARE_PLAY, GAME_STATUS_PREPARE_REVIEW } from '../../../sub_modules/game/src/gameConfig';
import { CARD_BOX_ANSWER_BOOKMARK, CARD_BOX_ANSWER_CORRECT, CARD_BOX_ANSWER_INCORRECT, CARD_BOX_NO_ANSWER, CARD_STUDY_ORDER_CORRECT, CARD_STUDY_ORDER_INCORRECT, CARD_STUDY_ORDER_MARKED, CARD_STUDY_ORDER_NONE, TOPIC_CONTENT_TYPE_FLASH_CARD } from '../../../sub_modules/share/constraint';
import MyCardData from '../../../sub_modules/share/model/myCardData';
import { StudyScore } from '../../../sub_modules/share/model/studyScore';
import Topic from '../../../sub_modules/share/model/topic';
import { UserInfo } from '../../../sub_modules/share/model/user';
import { getGameSlug } from '../../../utils';
import { canPlayTopic } from '../../../utils/permission/topic.permission';
import StaticLabelSlider from "../../StaticLabelSlider";
import useTopicWidgetStyles from "./useTopicWidgetStyles";

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

const MyCardDataView = (props: {
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
    if (isFlashCard) {
      dispatch(setExerciseOptionsAction({ target: "questionsPlayNum", value: numCard }));
      dispatch(setExerciseOptionsAction({ target: "cardStudyOrder", value: box }));
      dispatch(prepareGoToGameAction({ statusGame: GAME_STATUS_PREPARE_PLAY }));
    } else {
      dispatch(prepareGoToGameAction({ statusGame: GAME_STATUS_PREPARE_REVIEW, studyScore, boxGame: box }));
    }
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
      color: "#FF8474",
      cardOrder: CARD_STUDY_ORDER_INCORRECT,
    },
    [CARD_BOX_ANSWER_CORRECT]: {
      label: "Đã thuộc",
      icon: correctAnswerIcon,
      numCard: cardCorrectArr.length,
      color: "#2DC27C",
      cardOrder: CARD_STUDY_ORDER_CORRECT,
    },
    [CARD_BOX_ANSWER_BOOKMARK]: {
      label: "Đánh dấu",
      icon: bookmarkAnswerIcon,
      numCard: cardBookMark.length,
      color: "#02C2E8",
      cardOrder: CARD_STUDY_ORDER_MARKED,
    },
    [CARD_BOX_NO_ANSWER]: {
      label: "Chưa học",
      icon: notAnswerIcon,
      numCard: numCardNotAnswer,
      color: "#FFBE40",
      cardOrder: CARD_STUDY_ORDER_NONE
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
              onClick={() => { onClickBox(isFlashCard ? mapBoxLabel[box].cardOrder : box, mapBoxLabel[box].numCard) }}
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

export default MyCardDataView;