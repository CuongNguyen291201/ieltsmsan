import { Box, Button, Grid, Theme, Tooltip, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";
import moment from "moment";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommentScopes } from "../../custom-types";
import useHeadingsData from "../../hooks/useHeadingsData";
import WaitingLiveIcon from '../../public/images/icons/waiting-live.svg';
import { AppState } from "../../redux/reducers";
import { useRealtime } from "../../sub_modules/firebase/src/FirebaseContext";
import ScenarioInfo from "../../sub_modules/share/model/scenarioInfo";
import { apiGetDataDetailLesson, apiGetTimeStamp, apiUpdateTopicProgress } from "../../utils/apis/topicApi";
import { canPlayTopic } from "../../utils/permission/topic.permission";
import CourseTopicTreeView from "../CourseDetail/CourseTopicTreeView";
import { InformationCourse } from "../CourseDetail/InformationCourse/information-course";
import SanitizedDiv from "../SanitizedDiv";
import registerServiceWorker, { clearCountDown, countDownTimer, unregister } from "../ServiceWorker/registerServiceWorker";
import StreamComponent from "../Stream";
import VideoPlayer from "../VideoPlayer";
import TopicPrivateView from "./TopicPrivateView";
import TopicUnauthView from "./TopicUnauthView";
import useTopicContentStyles from "./useTopicContentStyles";

const DocumentsList = dynamic(() => import('./DocumentList'), { ssr: false });
const CommentPanel = dynamic(() => import('../CommentPanelNew'), { ssr: false });
const TableOfContent = dynamic(() => import('../TableOfContent'), { ssr: false });

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
  const { isJoinedCourse, currentCourse: course } = useSelector((state: AppState) => state.courseReducer);
  const firebaseInstance = useRealtime();
  const [dataScenario, setDataScenario] = useState<ScenarioInfo>();
  const [dataTotalUser, setDataTotalUser] = useState(0);
  const [dataCurrentTime, setDataCurrentTime] = useState(0);
  const [isEndLive, setEndLive] = useState(false);
  const [countDownTime, setCountDownTime] = useState<number>();
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
    if (topic.videoUrl) {
      registerServiceWorker();
      fetchDataScenario();
    }
    return () => {
      clearCountDown();
      unregister();
    }
  }, []);

  useEffect(() => {
    if (countDownTime === 0) {
      console.log('Start Live');
      fetchDataScenario(); // TODO - refactor
    }
  }, [countDownTime]);

  useEffect(() => {
    if (currentUser && topic && dataScenario?.endTime && dataCurrentTime < dataScenario?.endTime) {
      firebaseInstance.realtimeDb.ref().child(`count-users-live-stream-${topic._id}`).on('value', (snapshot) => {
        setDataTotalUser((snapshot?.val() && Object.values(snapshot?.val())?.length) ?? 0);
      });
      firebaseInstance.realtimeDb.ref().child(`count-users-live-stream-${topic._id}`).child(`${currentUser._id}`).set(`${currentUser.name}`)
      firebaseInstance.realtimeDb.ref().child(`count-users-live-stream-${topic._id}`).child(`${currentUser._id}`).onDisconnect().remove();
    }
  }, [topic, dataCurrentTime, dataScenario, currentUser]);

  const fetchDataScenario = async () => {
    const dataDetailLesson = await apiGetDataDetailLesson({ topicId: topic._id });
    const { timeStamp } = await apiGetTimeStamp();
    const dataScenario = dataDetailLesson.scenarioInfos[0] ?? null;
    if (!!dataScenario) {
      if ((dataScenario.startTime > timeStamp) && !!dataScenario.endTime) {
        countDownTimer(Math.round((dataScenario.startTime - timeStamp) / 1000), (_time) => {
          console.log(_time);
          setCountDownTime(_time);
        });
      }

    }
    setDataCurrentTime(timeStamp ?? moment().valueOf());
    setDataScenario(dataScenario);
  }

  const renderVideoView = () => {
    if (dataCurrentTime >= dataScenario?.startTime && !isEndLive) {
      if (dataScenario?.endTime && dataCurrentTime < dataScenario?.endTime) {
        return <Box>
          <StreamComponent dataTotalUser={dataTotalUser} dataScenario={dataScenario} setIsEndLive={setEndLive} />
        </Box>
      } else {
        // Normal Video. If Scenario, return Scenario
        return <Box>
          <VideoPlayer videoUrl={topic.videoUrl} playOnRender={false} />
        </Box>
      }
    } else if (dataCurrentTime < dataScenario?.startTime && dataScenario?.endTime) {
      // Waiting Live
      return <Box className={classes.waitingLiveBox}>
        <img src={WaitingLiveIcon} alt="waiting" />
        <Typography className={classes.waitingLiveCountDown}>
          {moment.utc(countDownTime * 1000).format("HH:mm:ss")}
        </Typography>
        <Typography>LiveStream sẽ diễn ra lúc {moment(dataScenario?.startTime).format("HH:mm DD/MM/YYYY")}</Typography>
      </Box>
    } else if (isEndLive) {
      return <Box className={classes.waitingLiveBox}>
        <img src={WaitingLiveIcon} alt="waiting" />
        <Typography>LiveStream đã kết thúc</Typography>
      </Box>
    } else if (dataCurrentTime < dataScenario?.startTime && !dataScenario?.endTime) {
      return <Box className={classes.waitingLiveBox}>
        <img src={WaitingLiveIcon} alt="waiting" />
        <Typography>Video sẽ sớm phát lại</Typography>
      </Box>
    }
  }

  return (
    <div id="lesson-view" className={classes.mainView}>
      {!currentUser
        ? <TopicUnauthView />
        : (!canPlayTopic({ topic, isJoinedCourse })
          ? <TopicPrivateView />
          : <Grid container className={classes.mainGrid}>
            <Grid item xs={12} md={isVideoTheaterMode ? 12 : 8}>
              <Box>
                {!!isVideoContent
                  && <Box className={classes.boxContent}>
                    {renderVideoView()}
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
                  </Box>
                }
              </Box>

              <Box sx={{ margin: { xs: "0 8px", md: "0 16px" } }}>
                <DocumentsList topicId={topic._id} />
              </Box>

              {!!topic.description && <Box className={classes.boxContent} ref={contentRef}>
                <Box className={classNames(classes.tableOfContent, classes.tableOfContentMobile, isVideoTheaterMode ? 'theater-mode' : '')}>
                  <TableOfContent nestedHeadings={nestedHeadings} />
                </Box>
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

                <Grid item xs={12}>
                  {!!topic.description && <Box mt="32px" className={classNames(classes.tableOfContent, classes.tableOfContentDesktop, isVideoTheaterMode ? 'theater-mode' : '')}>
                    <TableOfContent nestedHeadings={nestedHeadings} />
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
        )
      }
    </div>
  )
}

export default LessonView;