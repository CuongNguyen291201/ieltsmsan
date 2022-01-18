import { Box, Button, MenuItem, Select } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapCardStudyOrderLabel } from "../../../custom-types/MapContraint";
import { setExerciseOptionsAction } from "../../../redux/actions/exam.action";
import { AppState } from "../../../redux/reducers";
import { showLoginModalAction } from "../../../sub_modules/common/redux/actions/userActions";
import { CARD_STUDY_ORDER_CORRECT, CARD_STUDY_ORDER_DEFAULT, CARD_STUDY_ORDER_INCORRECT, CARD_STUDY_ORDER_MARKED, CARD_STUDY_ORDER_NONE, TOPIC_CONTENT_TYPE_FLASH_CARD, TOPIC_TYPE_TEST } from "../../../sub_modules/share/constraint";
import { StudyScore } from "../../../sub_modules/share/model/studyScore";
import Topic from "../../../sub_modules/share/model/topic";
import { FLASH_CARD_QUESTIONS_KEY } from "../../../utils/contrants";
import { canPlayTopic } from "../../../utils/permission/topic.permission";
import { ROUTER_GAME } from "../../../utils/router";
import useTopicWidgetStyles from "./useTopicWidgetStyles";

const TopicInfoCommonView = (props: { currentTopic: Topic, studyScore?: StudyScore | null; hidePlayGameButton?: boolean; }) => {
  const { currentTopic, studyScore, hidePlayGameButton } = props;
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const examReducer = useSelector((state: AppState) => state.examReducer);
  const { boxCorrect, boxIncorrect, boxMarked, boxNone } = useSelector((state: AppState) => state.topicReducer);
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
        const questionsPlayNumOptions = questionsNum <= 10 ? [questionsNum] : [...(_.range(10, questionsNum, 5)), questionsNum];
        data.push(
          { title: "Tổng số từ", number: `${questionsNum} từ` },
          {
            title: "Học",
            options: questionsPlayNumOptions.map((value) => ({ value, label: `${value} từ` })),
            onChange: (_value: string | number) => {
              const value = Number(_value);
              const mapQuestionsPlayNum = JSON.parse(window.localStorage.getItem(FLASH_CARD_QUESTIONS_KEY) || '{}');
              dispatch(setExerciseOptionsAction({ target: "questionsPlayNum", value }));
              window.localStorage.setItem(FLASH_CARD_QUESTIONS_KEY, JSON.stringify({ ...mapQuestionsPlayNum, [currentTopic._id]: value }))
            },
            initOption: () => {
              const mapQuestionsPlayNum = JSON.parse(window.localStorage.getItem(FLASH_CARD_QUESTIONS_KEY) || '{}');
              const defaultQuestionsPlayNum = parseInt(mapQuestionsPlayNum[currentTopic._id] || questionsNum);
              dispatch(setExerciseOptionsAction({ target: "questionsPlayNum", value: defaultQuestionsPlayNum }));
              window.localStorage.setItem(FLASH_CARD_QUESTIONS_KEY, JSON.stringify({ ...mapQuestionsPlayNum, [currentTopic._id]: defaultQuestionsPlayNum }))
            },
            optionKey: "questionsPlayNum"
          },
          {
            title: "Tuỳ chọn",
            options: [
              { value: CARD_STUDY_ORDER_DEFAULT, label: MapCardStudyOrderLabel[CARD_STUDY_ORDER_DEFAULT] },
              { value: CARD_STUDY_ORDER_CORRECT, label: MapCardStudyOrderLabel[CARD_STUDY_ORDER_CORRECT] },
              { value: CARD_STUDY_ORDER_INCORRECT, label: MapCardStudyOrderLabel[CARD_STUDY_ORDER_INCORRECT] },
              { value: CARD_STUDY_ORDER_NONE, label: MapCardStudyOrderLabel[CARD_STUDY_ORDER_NONE] },
              { value: CARD_STUDY_ORDER_MARKED, label: MapCardStudyOrderLabel[CARD_STUDY_ORDER_MARKED] },
            ],
            onChange: (value: number | string) => {
              dispatch(setExerciseOptionsAction({ target: "cardStudyOrder", value: Number(value) }))
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
                  <Select className={classes.topicDataSelect} value={examReducer[e.optionKey]} onChange={(evt) => e.onChange(evt.target.value)}>
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

export default TopicInfoCommonView;