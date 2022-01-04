import { Box, Button, Grid, Paper, Tooltip, Typography } from '@mui/material';
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CommentScopes } from '../../custom-types';
import { AppState } from '../../redux/reducers';
import ChartBar from '../../sub_modules/common/components/chart/ChartBar';
import { EXAM_SCORE_FINISH } from '../../sub_modules/share/constraint';
import Skill from "../../sub_modules/share/model/skill";
import Topic from '../../sub_modules/share/model/topic';
import CourseTopicTreeView from "../CourseDetail/CourseTopicTreeView";
import { InformationCourse } from '../CourseDetail/InformationCourse/information-course';
import SanitizedDiv from "../SanitizedDiv";
import VideoPlayer from "../VideoPlayer";
import ExamTOEICResutls from "./ExamTOEICResults";
import StatisticSkillView from "./StatisticSkillView";
import TestOverView from './topic-widgets/TestOverview';
import { TopicInfoCommonView } from './topic-widgets/TopicWidget';
import useTopicContentStyles from "./useTopicContentStyles";

const CommentPanelNew = dynamic(() => import('../CommentPanelNew'), { ssr: false });
const DocumentsList = dynamic(() => import('./DocumentList'), { ssr: false });

const TestInfoView = (props: { skills?: Skill[] }) => {
  const { skills = [] } = props;
  const { currentTopic: topic, studyScore, myCardData } = useSelector((state: AppState) => state.topicReducer);
  const { currentCourse: course } = useSelector((state: AppState) => state.courseReducer);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const isPlayTest = useMemo(() => !!studyScore, [studyScore]);
  const isFinisedTest = useMemo(() => studyScore?.status === EXAM_SCORE_FINISH, [studyScore]);
  const classes = useTopicContentStyles();
  const [isVideoTheaterMode, setVideoTheaterMode] = useState(false);
  const [showComment, setShowComment] = useState(true);
  const isVideoContent = useMemo(() => !!topic.videoUrl, [topic]);

  return (
    <div id="test-info-view" className={classes.mainView}>
      <Grid container className={classes.mainGrid}>
        <Grid item xs={12} md={isVideoTheaterMode ? 12 : 8}>
          {!!isVideoContent && <Box className={classes.boxContent}>
            <VideoPlayer videoUrl={topic.videoUrl} />
            <Box textAlign="right" mt="25px">
              <b>Chế độ xem:</b>
              <Tooltip title="Thu nhỏ">
                <i
                  onClick={() => setVideoTheaterMode(false)}
                  className="far fa-columns"
                  style={{ cursor: 'pointer', fontSize: '18px', margin: '0px 5px', color: isVideoTheaterMode ? '#AAAFB2' : '#000000' }}
                />
              </Tooltip>

              <Tooltip title="Mở rộng">
                <i
                  onClick={() => setVideoTheaterMode(true)}
                  className="far fa-rectangle-landscape"
                  style={{ cursor: 'pointer', fontSize: '18px', margin: '0px 5px', color: isVideoTheaterMode ? '#000000' : '#AAAFB2' }}
                />
              </Tooltip>
            </Box>
          </Box>}

          <Box sx={{ margin: { xs: "0 8px", md: "0 16px" } }}>
            <DocumentsList topicId={topic._id} />
          </Box>


          {isPlayTest && <Box className={classes.boxShadowContainer}
            sx={{ margin: { xs: "0 8px", md: "0 16px" }, paddingBottom: "40px" }}
          >
            <TestOverView
              currentTopic={topic}
              currentUser={currentUser}
              studyScore={studyScore}
              gameButtonGroupBoxStyle={{ padding: { xs: "0 8px", xl: "0 60px" } }}
            />
          </Box>}

          {!isVideoContent && !topic.description &&
            <>
              <Box
                className={classes.boxShadowContainer}
                sx={{
                  padding: { xs: "28px 8px", md: "28px 32px", lg: "28px 64px" },
                  marginLeft: isPlayTest ? { xs: "8px", md: "16px" } : undefined,
                  marginRight: isPlayTest ? { xs: "8px", md: "16px" } : undefined,
                  marginTop: { xs: "8px", md: "16px" }
                }}>
                <TopicInfoCommonView
                  currentTopic={topic}
                  studyScore={studyScore}
                  hidePlayGameButton={isPlayTest}
                />
              </Box>

              {isFinisedTest && !!skills.length && <Box className={classes.boxShadowContainer} sx={{
                marginTop: { xs: "8px", md: "16px" },
                marginRight: { xs: "8px", md: "16px" },
                marginLeft: { xs: "8px", md: "16px" }
              }}>
                <StatisticSkillView skills={skills} />
              </Box>}
            </>
          }

          {!!topic.description && <Box className={classes.boxContent}>
            <SanitizedDiv content={topic.description} />
          </Box>}

        </Grid>

        <Grid item xs={12} md={isVideoTheaterMode ? 12 : 4}>
          <Grid container columnSpacing={3}>
            <Grid item xs={12}>
              <Box>
                <Box className={classNames(classes.boxContent, classes.commentShadow, isVideoContent ? classes.commentPanelVideo : classes.commentPanel)} sx={{
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

            <Grid item xs={12} md={isVideoTheaterMode ? 8 : 12}>
              {/* <Box mt="30px" ml="16px">
                <h2>Danh sách bài học</h2>
                <CourseTopicTreeView course={course} />
              </Box> */}
            </Grid>

            <Grid item xs={12} md={isVideoTheaterMode ? 4 : 12}>
              <Box mt="30px">
                <InformationCourse course={course} />
              </Box>
            </Grid>

          </Grid>
        </Grid>
      </Grid>

      {(isVideoContent || !!topic.description) &&
        <>
          <Box
            className={classes.boxShadowContainer}
            sx={{
              padding: { xs: "28px 8px", md: "28px 32px", lg: "28px 64px" }, marginTop: "32px"
            }}>
            <TopicInfoCommonView
              currentTopic={topic}
              studyScore={studyScore}
              hidePlayGameButton={isPlayTest}
            />
          </Box>

          {isFinisedTest && !!skills.length && <Box className={classes.boxShadowContainer}
            sx={{
              padding: { xs: "28px 8px", md: "28px 32px", lg: "28px 64px" }, marginTop: "32px"
            }}
          >
            <StatisticSkillView skills={skills} />
          </Box>}
        </>
      }
    </div>
  )
}

export default TestInfoView;
