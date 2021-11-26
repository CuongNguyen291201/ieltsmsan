import { Grid } from "@material-ui/core";
import moment from 'moment';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommentScopes } from '../../custom-types';
import iconWaiting from '../../public/default/waiting-live.svg';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { useRealtime } from "../../sub_modules/firebase/src/FirebaseContext";
import ScenarioInfo from '../../sub_modules/share/model/scenarioInfo';
import Topic from '../../sub_modules/share/model/topic';
import { apiGetTimeStamp, apiUpdateTopicProgress, getOneVideoScenarioAPI } from '../../utils/apis/topicApi';
import { canPlayTopic } from '../../utils/permission/topic.permission';
import { getCoursePageSlug } from '../../utils/router';
import CourseTopicTreeView from '../CourseDetail/CourseTopicTreeView';
import { InformationCourse } from '../CourseDetail/InformationCourse/information-course';
import SanitizedDiv from '../SanitizedDiv';
import registerServiceWorker, { clearCountDown, countDownTimer, unregister } from '../ServiceWorker/registerServiceWorker';
import StreamComponent from '../Stream';
import VideoPlayer from "../VideoPlayer";
import './lesson-info.scss';

// const ScenarioGame = dynamic(() => import('../../sub_modules/scenario/src/main/ScenarioGame'), { ssr: false })
const CommentPanel = dynamic(() => import('../CommentPanelNew'), { ssr: false });
const DocumentsList = dynamic(() => import("./DocumentList"), { ssr: false });

const LessonInfoView = (props: { topic: Topic }) => {
  const { topic } = props;
  const refCountDown = useRef<any>();
  const firebaseInstance = useRealtime();
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { isJoinedCourse } = useSelector((state: AppState) => state.courseReducer);
  const [dataScenario, setDataScenario] = useState<ScenarioInfo>();
  const [dataTotalUser, setDataTotalUser] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [dataTimeCurrent, setDataTimeCurrent] = useState(0);
  const [isEndLive, setIsEndLive] = useState(false)
  const [countDown, setCountDown] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) return;
    if (!topic.videoUrl) {
      apiUpdateTopicProgress({
        topicId: topic._id, userId: currentUser._id, progress: 100
      });
    }
    if (topic?._id) {
      registerServiceWorker();
      fetchDataScenario()
    }
    return () => {
      clearCountDown();
      unregister();
    }
  }, []);

  useEffect(() => {
    if (countDown === 0) {
      console.log('start live');
      fetchDataScenario();
    }
  }, [countDown]);

  useEffect(() => {
    if (currentUser && topic._id && dataScenario?.endTime && dataTimeCurrent < dataScenario?.endTime) {
      firebaseInstance.realtimeDb.ref().child(`count-users-live-stream-${topic._id}`).on("value", (snapshot) => {
        setDataTotalUser((snapshot?.val() && Object.values(snapshot?.val())?.length) ?? 0)
      })
      firebaseInstance.realtimeDb.ref().child(`count-users-live-stream-${topic._id}`).child(`${currentUser._id}`).set(`${currentUser.name}`)
      firebaseInstance.realtimeDb.ref().child(`count-users-live-stream-${topic._id}`).child(`${currentUser._id}`).onDisconnect().remove()
    }
  }, [topic, dataTimeCurrent, dataScenario, currentUser]);

  const fetchDataScenario = async () => {
    const dataArrTemp = await getOneVideoScenarioAPI({ topicId: topic?._id })
    const dataTime = await apiGetTimeStamp({})
    const dataScenarioTemp = dataArrTemp?.scenarioInfos?.[0] ?? []
    setDataTimeCurrent(dataTime.timeStamp ?? moment().valueOf())
    if ((dataScenarioTemp.startTime > dataTime.timeStamp) && dataScenarioTemp?.endTime) {
      countDownTimer(Math.round((dataScenarioTemp.startTime - dataTime.timeStamp) / 1000), (_time: number) => {
        console.log(_time);
        setCountDown(_time)
      })
    }
    setDataScenario(dataScenarioTemp)
  }

  return (
    <div className="lesson-detail">
      {
        canPlayTopic({ topic, isJoinedCourse })
          ? <>
            {(topic._id === dataScenario?.topicId) ? (
              <div className={isFullScreen ? 'video-component-fullscreen video-commponent' : 'video-commponent'}>
                <Grid container className="video-live" spacing={5}>
                  {(dataTimeCurrent >= dataScenario?.startTime) && !isEndLive && (
                    <Grid item xs={12} xl={isFullScreen ? 12 : 8} md={isFullScreen ? 12 : 8}>
                      {dataScenario?.endTime && dataTimeCurrent < dataScenario?.endTime ? (
                        <div className="streaming">
                          <StreamComponent dataTotalUser={dataTotalUser} dataScenario={new ScenarioInfo(dataScenario)} setIsEndLive={setIsEndLive} />
                        </div>
                      ) : (
                        <div className="video-scenario">
                          <VideoPlayer videoUrl={topic.videoUrl || dataScenario.url} playOnRender={false} />
                          {/* <ScenarioGame currentUser={currentUser} scenarioInfo={new ScenarioInfo(dataScenario)} /> */}
                        </div>
                      )}

                      <div className="view-mode">Chế độ xem:
                        <i
                          onClick={() => setIsFullScreen(false)}
                          className="far fa-columns"
                          style={{ cursor: 'pointer', fontSize: '18px', margin: '0px 5px', color: isFullScreen ? '#AAAFB2' : '#000000' }}
                        />
                        <i
                          onClick={() => setIsFullScreen(true)}
                          className="far fa-rectangle-landscape"
                          style={{ cursor: 'pointer', fontSize: '18px', margin: '0px 5px', color: isFullScreen ? '#000000' : '#AAAFB2' }}
                        />
                      </div>
                      <DocumentsList topicId={topic._id} />
                    </Grid>
                  )}
                  {(dataTimeCurrent < dataScenario?.startTime) && dataScenario.endTime ? (
                    <Grid item xl={8} md={8} xs={12}>
                      <div className="waiting-live">
                        <div className="item_">
                          <img src={iconWaiting} alt="iconWaiting" />
                          <div className="count-down">
                            {moment.utc(countDown * 1000).format('HH:mm:ss')}
                          </div>
                          <div>LiveStream sẽ diễn ra vào lúc {moment(dataScenario?.startTime).format('HH:mm DD/MM/YYYY')}</div>
                        </div>
                      </div>
                    </Grid>
                  ) : null}
                  {isEndLive && (
                    <Grid item xl={8} md={8} xs={12}>
                      <div className="waiting-live">
                        <div className="item_">
                          <img src={iconWaiting} alt="iconWaiting" />
                          <div>LiveStream đã kết thúc</div>
                        </div>
                      </div>
                    </Grid>
                  )}
                  {(dataTimeCurrent < dataScenario?.startTime) && !dataScenario.endTime && (
                    <Grid item xl={8} md={8} xs={12}>
                      <div className="waiting-live">
                        <div className="item_">
                          <img src={iconWaiting} alt="iconWaiting" />
                          <div>Video sẽ có lúc {moment(dataScenario?.startTime).format('HH:mm DD/MM/YYYY')}</div>
                        </div>
                      </div>
                    </Grid>
                  )}
                  {!isFullScreen && <Grid item xl={4} md={4} xs={12}>
                    <div className="comment">
                      <CommentPanel commentScope={CommentScopes.TOPIC} />
                    </div>
                  </Grid>}
                  {topic.description && (
                    <Grid item xl={isFullScreen ? 12 : 8} md={isFullScreen ? 12 : 8} xs={12}>
                      <SanitizedDiv className="description" content={topic.description} />
                    </Grid>
                  )}
                </Grid>
              </div>
            ) : (
              <div className="video-component-fullscreen video-commponent">
                <Grid container spacing={5}>
                  <Grid item xl={isFullScreen ? 12 : 8} md={isFullScreen ? 12 : 8} xs={12}>
                    {topic.videoUrl && <>
                      <VideoPlayer playOnRender={false} videoUrl={topic.videoUrl} />
                      <div className="view-mode">Chế độ xem:
                        <i
                          onClick={() => setIsFullScreen(false)}
                          className="far fa-columns"
                          style={{ cursor: 'pointer', fontSize: '18px', margin: '0px 5px', color: isFullScreen ? '#AAAFB2' : '#000000' }}
                        />
                        <i
                          onClick={() => setIsFullScreen(true)}
                          className="far fa-rectangle-landscape"
                          style={{ cursor: 'pointer', fontSize: '18px', margin: '0px 5px', color: isFullScreen ? '#000000' : '#AAAFB2' }}
                        />
                      </div>
                      <DocumentsList topicId={topic._id} />
                    </>}
                    {topic.description && <SanitizedDiv className="description" content={topic.description} />}
                  </Grid>
                  {!isFullScreen && <Grid item xl={4} md={4} xs={12}>
                    <div className="comment">
                      <CommentPanel commentScope={CommentScopes.TOPIC} />
                    </div>
                  </Grid>}
                </Grid>
              </div>
            )}
            <Grid container className="info-topic">
              <Grid item xs={12} md={8}>
                <div className="course-topic-tree">
                  <CourseTopicTreeView course={topic.course} />
                </div>
              </Grid>
              <Grid item xs={12} md={4} className="info">
                <InformationCourse course={topic.course} />
              </Grid>
            </Grid>
          </>
          : <Grid container spacing={5}>
            <Grid item xs={12} md={8}>
              <div id="topic-private-view">
                {currentUser
                  ? <div className="private-lesson private-lession-not-joined">
                    <i className="far fa-exclamation" />
                    <div className="tooltip">
                      Chưa tham gia khoá học!&nbsp;
                      <span className="action" onClick={() => {
                        router.push(getCoursePageSlug({ course: topic.course }));
                      }}>Quay lại</span>
                    </div>
                  </div>
                  : <div className="private-lesson private-lession-unauthorized">
                    <i className="far fa-exclamation" />
                    <div className="tooltip">Vui lòng <span className="action" onClick={() => {
                      dispatch(showLoginModalAction(true));
                    }}>đăng nhập</span> để tiếp tục</div>
                  </div>
                }
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <InformationCourse course={topic.course} />
            </Grid>
          </Grid>
      }
    </div >
  );
}

export default LessonInfoView;
