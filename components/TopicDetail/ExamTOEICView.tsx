import { Box, Button, Grid, Typography } from "@mui/material";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useRef, useState } from "react";
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
import SanitizedDiv from "../SanitizedDiv";
import ExamTOEICResutls from "./ExamTOEICResults";
import StatisticSkillView from "./StatisticSkillView";
import useTopicWidgetStyles from "./topic-widgets/useTopicWidgetStyles";
import useTopicContentStyles from "./useTopicContentStyles";

const DocumentsListView = dynamic(() => import('./DocumentsListView'), { ssr: false });
const TableOfContents = dynamic(() => import('../TableOfContents'), { ssr: false });

const ExamTOEICView = () => {
  const { currentTopic: topic, studyScore, myCardData } = useSelector((state: AppState) => state.topicReducer);
  const course = useSelector((state: AppState) => state.courseReducer.currentCourse);
  const isJoinedCourse = useSelector((state: AppState) => state.courseReducer.isJoinedCourse);
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser);
  const nestedHeadings = useSelector((state: AppState) => state.contentReducer.headings);

  const dispatch = useDispatch();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement | null>(null);

  const classes = { ...useTopicContentStyles(), ...useTopicWidgetStyles() };
  const { enqueueSnackbar } = useSnackbar();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [showComment, setShowComment] = useState(true);

  const isPlayTest = useMemo(() => !!studyScore, [studyScore]);
  const isFinishedTest = useMemo(() => studyScore?.status === EXAM_SCORE_FINISH, [studyScore]);
  const isVideoContent = useMemo(() => !!topic.videoUrl, [topic]);

  const { gameButtonLabel } = useMemo(() => {
    let gameButtonLabel = '';
    if (studyScore?.status === EXAM_SCORE_FINISH) {
      gameButtonLabel = 'L??m l???i'
    } else if (studyScore?.status === EXAM_SCORE_PAUSE || studyScore?.status === EXAM_SCORE_PLAY) {
      gameButtonLabel = 'Ti???p t???c'
    } else {
      gameButtonLabel = 'L??m b??i'
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
      enqueueSnackbar("Ch??a tham gia kho?? h???c", { variant: "warning" });
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
    <div id="toeic-view">
      <Box display="flex" flexDirection={isPlayTest ? "column-reverse" : "column"}>
        {/* CONTENT TEXT */}
        {!!topic.description && <Box component="div" className={classes.boxContent} ref={contentRef}>
          <Box className={classNames(classes.tableOfContent, classes.tableOfContentMobile)}>
            <TableOfContents nestedHeadings={nestedHeadings} stickyClass="no-sticky-table-of-content" />
          </Box>
          <SanitizedDiv content={topic.description} />
          {!isVideoContent && <Box>
            <DocumentsListView />
          </Box>}
        </Box>}

        {/* TEST INFO */}
        <Grid container>
          <Grid item xs={12}>
            {isFinishedTest && <Box>
              <ExamTOEICResutls />
            </Box>}

            <Box
              className={classNames(classes.boxContent, classes.boxShadowContainer)}
            >
              <Box textAlign="center"><h2>Th??ng tin chung</h2></Box>
              <Box>
                <Box className={classes.topicOverviewItem}>
                  <Box className={classes.topicOverviewLabel}>S??? c??u h???i</Box>
                  <Box className={classes.topicOverviewValue}>{topic.topicExercise?.questionsNum ?? 0} c??u h???i</Box>
                </Box>

                <Box className={classes.topicOverviewItem}>
                  <Box className={classes.topicOverviewLabel}>Th???i gian l??m b??i</Box>
                  <Box className={classes.topicOverviewValue}>{topic.topicExercise?.duration ?? 0} ph??t</Box>
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

                {isFinishedTest && <Button className={classNames(classes.gameButton, classes.gameButtonReview)} onClick={() => goToGame(true)}>
                  Xem gi???i chi ti???t
                </Button>}
              </Box>

            </Box>


            {isFinishedTest && <Box className={classes.boxContent}>
              <StatisticSkillView skills={skills} />
            </Box>}
          </Grid>
        </Grid>

        {!isVideoContent && !topic.description && <Box>
          <DocumentsListView />
        </Box>}
      </Box>
    </div>
  );
}

export default ExamTOEICView;