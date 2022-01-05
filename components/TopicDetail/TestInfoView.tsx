import { Box, Button, Grid } from '@mui/material';
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { CommentScopes } from '../../custom-types';
import useHeadingsData from "../../hooks/useHeadingsData";
import { AppState } from '../../redux/reducers';
import { EXAM_SCORE_FINISH } from '../../sub_modules/share/constraint';
import Skill from "../../sub_modules/share/model/skill";
import { InformationCourse } from '../CourseDetail/InformationCourse/information-course';
import SanitizedDiv from "../SanitizedDiv";
import StatisticSkillView from "./StatisticSkillView";
import TestOverView from './topic-widgets/TestOverview';
import { TopicInfoCommonView } from './topic-widgets/TopicWidget';
import useTopicContentStyles from "./useTopicContentStyles";
import VideoPanel from "./VideoPanel";

const CommentPanel = dynamic(() => import('../CommentPanelNew'), { ssr: false });
const DocumentsListPanel = dynamic(() => import('./DocumentsList/DocumentsListPanel'), { ssr: false });
const TableOfContents = dynamic(() => import('../TableOfContents'), { ssr: false });

const TestInfoView = (props: { skills?: Skill[] }) => {
  const { skills = [] } = props;
  const { currentTopic: topic, studyScore, myCardData } = useSelector((state: AppState) => state.topicReducer);
  const { currentCourse: course } = useSelector((state: AppState) => state.courseReducer);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const totalDocuments = useSelector((state: AppState) => state.topicDocumentReducer.totalDocuments);
  const isPlayTest = useMemo(() => !!studyScore, [studyScore]);
  const isFinisedTest = useMemo(() => studyScore?.status === EXAM_SCORE_FINISH, [studyScore]);
  const classes = useTopicContentStyles();
  const [isVideoTheaterMode, setVideoTheaterMode] = useState(false);
  const [showComment, setShowComment] = useState(true);
  const isVideoContent = useMemo(() => !!topic.videoUrl, [topic]);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { nestedHeadings, isReady } = useHeadingsData({ enabled: !!contentRef, rootElement: contentRef.current });

  const renderDocumentsList = () => {
    return !!totalDocuments && <Box className={classes.sectionPanelBorder}>
      <DocumentsListPanel />
    </Box>
  }

  return (
    <div id="test-info-view" className={classes.mainView}>
      <Grid container className={classes.mainGrid}>
        <Grid item xs={12} md={isVideoTheaterMode ? 12 : 8}>
          {!!isVideoContent && <Box className={classes.boxContent}>
            <VideoPanel isVideoTheaterMode={isVideoTheaterMode} setVideoTheaterMode={setVideoTheaterMode} />
            {renderDocumentsList()}
          </Box>}

          {/* <Box sx={{ margin: { xs: "0 8px", md: "0 16px" } }}>
            <DocumentsList topicId={topic._id} />
          </Box> */}


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

          {!!topic.description && <Box className={classes.boxContent} ref={contentRef}>
            <Box className={classNames(classes.tableOfContent, classes.tableOfContentMobile, isVideoTheaterMode ? 'theater-mode' : '')}>
              <TableOfContents nestedHeadings={nestedHeadings} stickyClass="no-sticky-table-of-content" />
            </Box>
            <SanitizedDiv content={topic.description} />
          </Box>}

        </Grid>

        <Grid item xs={12} md={isVideoTheaterMode ? 12 : 4}>
          <Grid container columnSpacing={3}>
            <Grid item xs={12}>
              <Box
                className={classNames(classes.boxContent, classes.commentShadow)}
                sx={{ display: showComment ? undefined : "none" }}
              >
                <Box className={isVideoContent ? classes.commentPanelVideo : classes.commentPanel} sx={{
                  overflow: showComment ? "auto" : "hidden"
                }}>
                  <CommentPanel commentScope={CommentScopes.TOPIC} />
                </Box>
              </Box>
              <Box width="100%" mt={showComment ? 0 : { xs: "8px", md: "16px" }}>
                <Button sx={{ width: "100%" }}
                  variant="outlined"
                  onClick={() => setShowComment(!showComment)}>
                  {showComment ? 'Ẩn bình luận' : 'Hiển thị bình luận'}
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              {!!topic.description && <Box mt="32px" className={classNames(classes.tableOfContent, classes.tableOfContentDesktop, isVideoTheaterMode ? 'theater-mode' : '')}>
                <TableOfContents nestedHeadings={nestedHeadings} />
              </Box>}
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
