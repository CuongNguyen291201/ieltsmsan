import { Box, Theme, Tooltip, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import { PropsWithoutRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
// @ts-ignore
import WaitingLiveIcon from '../../public/images/icons/waiting-live.svg';
import { AppState } from "../../redux/reducers";
import { useRealtime } from "../../sub_modules/firebase/src/FirebaseContext";
import { TOPIC_TYPE_LESSON } from "../../sub_modules/share/constraint";
import ScenarioInfo from "../../sub_modules/share/model/scenarioInfo";
import { apiGetDataDetailLesson, apiGetTimeStamp } from "../../utils/apis/topicApi";
import registerServiceWorker, { clearCountDown, countDownTimer, unregister } from "../ServiceWorker/registerServiceWorker";
import StreamComponent from "../Stream";
import VideoPlayer from "../VideoPlayer";

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

const VideoPanel = (props: PropsWithoutRef<{
  isVideoTheaterMode?: boolean;
  setVideoTheaterMode?: (isVideoTheaterMode: boolean) => void;
}>) => {
  const { isVideoTheaterMode = false, setVideoTheaterMode = () => { } } = props;
  const topic = useSelector((state: AppState) => state.topicReducer.currentTopic);
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser);
  const firebaseInstance = useRealtime();
  const [dataScenario, setDataScenario] = useState<ScenarioInfo>();
  const [dataTotalUser, setDataTotalUser] = useState(0);
  const [dataCurrentTime, setDataCurrentTime] = useState(0);
  const [isEndLive, setEndLive] = useState(false);
  const [countDownTime, setCountDownTime] = useState<number>();
  const classes = useStyles();

  useEffect(() => {
    if (topic.type === TOPIC_TYPE_LESSON) {
      registerServiceWorker();
      fetchDataScenario();
    }
    return () => {
      if (topic.type === TOPIC_TYPE_LESSON) {
        clearCountDown();
        unregister();
      }
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
    return <Box>
      <VideoPlayer videoUrl={topic.videoUrl} />
    </Box>
  }

  return (
    <>
      {renderVideoView()}
      <Box textAlign="right" mt="24px">
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
    </>
  )
}

export default VideoPanel;
