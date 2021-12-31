import { Button, Grid, Tooltip } from '@mui/material';
import { Box } from "@mui/system";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useSelector } from 'react-redux';
import { CommentScopes, _Topic } from '../../custom-types';
import { AppState } from '../../redux/reducers';
import CourseTopicTreeView from "../CourseDetail/CourseTopicTreeView";
import { InformationCourse } from '../CourseDetail/InformationCourse/information-course';
import SanitizedDiv from "../SanitizedDiv";
import VideoPlayer from "../VideoPlayer";
import { MyCardDataView, TopicInfoCommonView } from './topic-widgets/TopicWidget';
import useTopicContentStyles from "./useTopicContentStyles";

const DocumentsList = dynamic(() => import('./DocumentList'), { ssr: false });
const CommentPanel = dynamic(() => import('../CommentPanelNew'), { ssr: false });

const ExerciseInfoView = () => {
  const { currentTopic: topic, studyScore, myCardData } = useSelector((state: AppState) => state.topicReducer);
  const { currentCourse: course, isJoinedCourse } = useSelector((state: AppState) => state.courseReducer);
  const { currentUser: user } = useSelector((state: AppState) => state.userReducer);
  const classes = useTopicContentStyles();
  const [isVideoTheaterMode, setVideoTheaterMode] = useState(false);
  const [showComment, setShowComment] = useState(true);
  const isVideoContent = useMemo(() => !!topic.videoUrl, [topic]);

  return (
    <div id="exercise-view" className={classes.mainView}>
      <Grid container className={classes.mainGrid} >
        <Grid item xs={12} md={isVideoTheaterMode ? 12 : 8}>
          {!!isVideoContent && <Box className={classes.boxContent}>
            <VideoPlayer videoUrl={topic.videoUrl} />
            <Box textAlign="right" mt="25px" >
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

          {!!topic.description && <Box className={classes.boxContent}>
            <SanitizedDiv content={topic.description} />
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
        </Grid>

        <Grid item xs={12} md={isVideoTheaterMode ? 12 : 4}>
          <Grid container columnSpacing={3}>
            <Grid item xs={12}>
              <Box>
                <Box className={classNames(classes.boxContent, classes.commentShadow, isVideoContent ? classes.commentPanelVideo : classes.commentPanel)} sx={{
                  overflow: showComment ? "auto" : "hidden", display: showComment ? undefined : "none"
                }}>
                  <CommentPanel commentScope={CommentScopes.TOPIC} />
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
    </div>
  );
};

export default ExerciseInfoView;