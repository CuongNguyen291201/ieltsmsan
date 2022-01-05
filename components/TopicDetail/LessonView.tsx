import { Box, Button, Grid, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CommentScopes } from "../../custom-types";
import useHeadingsData from "../../hooks/useHeadingsData";
import { AppState } from "../../redux/reducers";
import { apiUpdateTopicProgress } from "../../utils/apis/topicApi";
import { InformationCourse } from "../CourseDetail/InformationCourse/information-course";
import SanitizedDiv from "../SanitizedDiv";
import useTopicContentStyles from "./useTopicContentStyles";
import VideoPanel from "./VideoPanel";

const DocumentsListPanel = dynamic(() => import('./DocumentsList/DocumentsListPanel'), { ssr: false });
const CommentPanel = dynamic(() => import('../CommentPanelNew'), { ssr: false });
const TableOfContents = dynamic(() => import('../TableOfContents'), { ssr: false });

const useStyles = makeStyles((theme: Theme) => ({
  waitingLiveBox: {
    backgroundColor: "#1D2D32",
    color: "#fff",
    height: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  waitingLiveCountDown: {
    backgroundColor: "#48505B",
    borderRadius: "30px",
    padding: "8px 16px"
  }
}));

const LessonView = () => {
  const topic = useSelector((state: AppState) => state.topicReducer.currentTopic);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { currentCourse: course } = useSelector((state: AppState) => state.courseReducer);
  const totalDocuments = useSelector((state: AppState) => state.topicDocumentReducer.totalDocuments);
  const [isVideoTheaterMode, setVideoTheaterMode] = useState(false);
  const [showComment, setShowComment] = useState(true);
  const isVideoContent = useMemo(() => !!topic.videoUrl, [topic]);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { nestedHeadings, isReady } = useHeadingsData({ enabled: !!contentRef, rootElement: contentRef.current });
  const classes = { ...useStyles(), ...useTopicContentStyles() };

  useEffect(() => {
    if (!currentUser) return;
    if (!topic.videoUrl) {
      apiUpdateTopicProgress({ topicId: topic._id, userId: currentUser._id, progress: 100 });
    }
  }, [currentUser]);

  const renderDocumentsList = () => {
    return !!totalDocuments && <Box className={classes.sectionPanelBorder}>
      <DocumentsListPanel />
    </Box>
  }

  return (
    <div id="lesson-view" className={classes.mainView}>

      <Grid container className={classes.mainGrid}>
        <Grid item xs={12} md={isVideoTheaterMode ? 12 : 8}>
          <Box>
            {!!isVideoContent
              && <Box className={classes.boxContent}>
                <VideoPanel isVideoTheaterMode={isVideoTheaterMode} setVideoTheaterMode={setVideoTheaterMode} />
                {renderDocumentsList()}
              </Box>
            }
          </Box>

          {!!topic.description && <Box className={classes.boxContent} ref={contentRef}>
            <Box className={classNames(classes.tableOfContent, classes.tableOfContentMobile, isVideoTheaterMode ? 'theater-mode' : '')}>
              <TableOfContents nestedHeadings={nestedHeadings} stickyClass="no-sticky-table-of-content" />
            </Box>
            <SanitizedDiv content={topic.description} />

            {!isVideoContent && renderDocumentsList()}
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


            {/* <Grid item xs={12} md={isVideoTheaterMode ? 8 : 12}>
                  <Box mt="30px" ml="16px">
                    <h2>Danh sách bài học</h2>
                    <CourseTopicTreeView course={course} />
                  </Box>
                </Grid> */}

            <Grid item xs={12} md={isVideoTheaterMode ? 4 : 12}>
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

export default LessonView;