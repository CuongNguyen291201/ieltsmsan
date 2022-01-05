import { Button, Grid } from '@mui/material';
import { Box } from "@mui/system";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { useSelector } from 'react-redux';
import { CommentScopes } from '../../custom-types';
import useHeadingsData from "../../hooks/useHeadingsData";
import { AppState } from '../../redux/reducers';
import { InformationCourse } from '../CourseDetail/InformationCourse/information-course';
import SanitizedDiv from "../SanitizedDiv";
import { MyCardDataView, TopicInfoCommonView } from './topic-widgets/TopicWidget';
import useTopicContentStyles from "./useTopicContentStyles";
import VideoPanel from "./VideoPanel";

const DocumentsListPanel = dynamic(() => import('./DocumentsList/DocumentsListPanel'), { ssr: false });
const CommentPanel = dynamic(() => import('../CommentPanelNew'), { ssr: false });
const TableOfContents = dynamic(() => import('../TableOfContents'), { ssr: false });

const ExerciseInfoView = () => {
  const { currentTopic: topic, studyScore, myCardData } = useSelector((state: AppState) => state.topicReducer);
  const { currentCourse: course, isJoinedCourse } = useSelector((state: AppState) => state.courseReducer);
  const { currentUser: user } = useSelector((state: AppState) => state.userReducer);
  const totalDocuments = useSelector((state: AppState) => state.topicDocumentReducer.totalDocuments);
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
    <div id="exercise-view" className={classes.mainView}>
      <Grid container className={classes.mainGrid} >
        <Grid item xs={12} md={isVideoTheaterMode ? 12 : 8}>
          {!!isVideoContent && <Box className={classes.boxContent}>
            <VideoPanel isVideoTheaterMode={isVideoTheaterMode} setVideoTheaterMode={setVideoTheaterMode} />
            {renderDocumentsList()}
          </Box>}

          {/* <Box sx={{ margin: { xs: "0 8px", md: "0 16px" } }}>
            <DocumentsList topicId={topic._id} />
          </Box> */}

          {!!topic.description && <Box className={classes.boxContent} ref={contentRef}>
            <Box className={classNames(classes.tableOfContent, classes.tableOfContentMobile, isVideoTheaterMode ? 'theater-mode' : '')}>
              <TableOfContents nestedHeadings={nestedHeadings} stickyClass="no-sticky-table-of-content" />
            </Box>
            <SanitizedDiv content={topic.description} />

            {!isVideoContent && renderDocumentsList()}
          </Box>}

          <Box className={classNames(classes.boxContent, classes.boxShadowContainer)} pb="50px !important">
            <MyCardDataView currentTopic={topic} studyScore={studyScore} myCardData={myCardData} user={user}
              sliderBoxStyle={{ padding: { xs: "0 8px", lg: "0 59px", xl: "0 134px" } }}
              cardDataBoxStyle={{ padding: { xs: "8px", lg: "0 59px", xl: "0 134px" } }}
              isJoinedCourse={isJoinedCourse}
              gameButtonGroupBoxStyle={{ padding: { xl: "0 70px" } }}
            />
          </Box>

          <Box
            className={classes.boxShadowContainer}
            sx={{
              padding: { xs: "28px 8px", md: "28px 32px", lg: "28px 64px" }, marginTop: "32px", marginRight: { md: "16px" }
            }}
          >
            <TopicInfoCommonView currentTopic={topic} studyScore={studyScore} hidePlayGameButton />
          </Box>
          {!isVideoContent && !topic.description && renderDocumentsList()}
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
    </div>
  );
};

export default ExerciseInfoView;