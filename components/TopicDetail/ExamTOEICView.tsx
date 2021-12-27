import { Box, Button, Grid, Typography } from "@mui/material";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommentScopes } from "../../custom-types";
import { setExamMapSkillTypeValuesAction } from "../../redux/actions/exam.action";
import { prepareGoToGameAction } from "../../redux/actions/prepareGame.actions";
import { AppState } from "../../redux/reducers";
import { showLoginModalAction } from "../../sub_modules/common/redux/actions/userActions";
import { GAME_STATUS_PREPARE_CONTINUE, GAME_STATUS_PREPARE_PLAY, GAME_STATUS_PREPARE_REVIEW } from "../../sub_modules/game/src/gameConfig";
import { EXAM_SCORE_FINISH, EXAM_SCORE_PAUSE, EXAM_SCORE_PLAY, EXAM_TYPE_TOEIC } from "../../sub_modules/share/constraint";
import Skill from "../../sub_modules/share/model/skill";
import { getGameSlug } from "../../utils";
import { apiGetListSkills } from "../../utils/apis/skill";
import { canPlayTopic } from "../../utils/permission/topic.permission";
import { InformationCourse } from "../CourseDetail/InformationCourse/information-course";
import ExamTOEICResutls from "./ExamTOEICResults";
import StatisticSkillView from "./StatisticSkillView";
import useTopicWidgetStyles from "./topic-widgets/useTopicWidgetStyles";
import useTopicContentStyles from "./useTopicContentStyles";

const CommentPanelNew = dynamic(() => import('../CommentPanelNew'), { ssr: false });

const ExamTOEICView = () => {
  const { currentTopic: topic, studyScore, myCardData } = useSelector((state: AppState) => state.topicReducer);
  const course = useSelector((state: AppState) => state.courseReducer.currentCourse);
  const isJoinedCourse = useSelector((state: AppState) => state.courseReducer.isJoinedCourse);

  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const classes = { ...useTopicContentStyles(), ...useTopicWidgetStyles() };
  const { enqueueSnackbar } = useSnackbar();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showComment, setShowComment] = useState(true);
  const isFinishedTest = useMemo(() => studyScore?.status === EXAM_SCORE_FINISH, [studyScore]);

  const { gameButtonLabel } = useMemo(() => {
    let gameButtonLabel = '';
    if (studyScore?.status === EXAM_SCORE_FINISH) {
      gameButtonLabel = 'Làm lại'
    } else if (studyScore?.status === EXAM_SCORE_PAUSE || studyScore?.status === EXAM_SCORE_PLAY) {
      gameButtonLabel = 'Tiếp tục'
    } else {
      gameButtonLabel = 'Làm bài'
    }
    return {
      gameButtonLabel,
    }
  }, [studyScore]);

  const goToGame = (isReview?: boolean) => {
    if (!currentUser) {
      dispatch(showLoginModalAction(true));
      return;
    }
    if (!canPlayTopic({ topic, isJoinedCourse })) {
      enqueueSnackbar("Chưa tham gia khoá học", { variant: "warning" });
      return;
    }
    dispatch(prepareGoToGameAction({
      statusGame: isReview
        ? GAME_STATUS_PREPARE_REVIEW :
        (
          (studyScore?.status === EXAM_SCORE_PAUSE || studyScore?.status === EXAM_SCORE_PLAY)
            ? GAME_STATUS_PREPARE_CONTINUE
            : GAME_STATUS_PREPARE_PLAY
        ),
      studyScore
    }));
    router.push(getGameSlug(topic._id));
  }

  useEffect(() => {
    apiGetListSkills({ examType: EXAM_TYPE_TOEIC })
      .then((skills) => {
        dispatch(setExamMapSkillTypeValuesAction(skills));

        const flattenSkillsArray: Skill[] = [];
        skills.forEach((skill) => {
          flattenSkillsArray.push(skill, ...skill.childSkills);
        });
        setSkills(flattenSkillsArray);
      })
  }, []);

  return (
    <div id="topic-toeic-test-view" className={classes.mainView}>
      <Grid container className={classes.mainGrid}>
        <Grid item xs={12} md={8}>
          {isFinishedTest && <Box className={classes.boxContent}>
            <ExamTOEICResutls />
          </Box>}

          <Box
            className={classNames(classes.boxContent, classes.boxShadowContainer)}
          >
            <Box textAlign="center"><h2>Thông tin chung</h2></Box>
            <Box>
              <Box className={classes.topicOverviewItem}>
                <Box className={classes.topicOverviewLabel}>Số câu hỏi</Box>
                <Box className={classes.topicOverviewValue}>{topic.topicExercise?.questionsNum ?? 0} câu hỏi</Box>
              </Box>

              <Box className={classes.topicOverviewItem}>
                <Box className={classes.topicOverviewLabel}>Thời gian làm bài</Box>
                <Box className={classes.topicOverviewValue}>{topic.topicExercise?.duration ?? 0} phút</Box>
              </Box>
            </Box>

            <Box sx={{
              display: "flex",
              gap: "50px",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "40px",
              flexDirection: {
                xs: "column",
                md: "row"
              }
            }}>
              <Button
                className={classNames(classes.gameButton, classes.gameButtonPlay)}
                onClick={() => goToGame()}
              >
                {gameButtonLabel}
              </Button>

              {studyScore?.status === EXAM_SCORE_FINISH && <Button className={classNames(classes.gameButton, classes.gameButtonReview)} onClick={() => goToGame(true)}>
                Xem giải chi tiết
              </Button>}
            </Box>

          </Box>


          {isFinishedTest && <Box className={classes.boxContent}>
            <StatisticSkillView skills={skills} />
          </Box>}
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container columnSpacing={3}>

            <Grid item xs={12}>
              <Box>
                <Box className={classNames(classes.boxContent, classes.commentShadow, classes.commentPanel)} sx={{
                  overflow: showComment ? "auto" : "hidden", display: showComment ? undefined : "none"
                }}>
                  <CommentPanelNew commentScope={CommentScopes.TOPIC} />
                </Box>
                <Box width="100%" mt={showComment ? 0 : { xs: "8px", md: "16px" }}>
                  <Button sx={{ width: "100%" }}
                    variant="outlined"
                    onClick={() => setShowComment(!showComment)}>
                    {showComment ? 'Ẩn bình luận' : 'Hiển thị bình luận'}
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={12}>
              <Box mt="30px">
                <InformationCourse course={course} />
              </Box>
            </Grid>

          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default ExamTOEICView;