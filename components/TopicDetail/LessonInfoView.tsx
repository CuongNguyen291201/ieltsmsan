import { Col, Row } from 'antd';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommentScopes } from '../../custom-types';
import { usePaginationState, useTotalPagesState } from '../../hooks/pagination';
import iconWaiting from '../../public/default/waiting-live.svg';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import { useRealtime } from "../../sub_modules/firebase/src/FirebaseContext";
import Document from '../../sub_modules/share/model/document';
import ScenarioInfo from '../../sub_modules/share/model/scenarioInfo';
import Topic from '../../sub_modules/share/model/topic';
import { fetchPaginationAPI } from '../../utils/apis/common';
import { apiCountDocumentsByTopic, apiOffsetDocumentByTopic, apiSeekDocumentByTopic } from '../../utils/apis/documentApi';
import { apiGetTimeStamp, apiUpdateTopicProgress, getOneVideoScenarioAPI } from '../../utils/apis/topicApi';
import { canPlayTopic } from '../../utils/permission/topic.permission';
import { getCoursePageSlug } from '../../utils/router';
import CommentPanel from '../CommentPanelNew';
import CourseTopicTreeView from '../CourseDetail/CourseTopicTreeView';
import { InformationCourse } from '../CourseDetail/InformationCourse/information-course';
import SanitizedDiv from '../SanitizedDiv';
import registerServiceWorker, { clearCountDown, countDownTimer, unregister } from '../ServiceWorker/registerServiceWorker';
import StreamComponent from '../Stream';
import VideoPlayer from "../VideoPlayer";
import './lesson-info.scss';
const ScenarioGame = dynamic(() => import('../../sub_modules/scenario/src/main/ScenarioGame'), { ssr: false })


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
  }, [topic, dataTimeCurrent, dataScenario, currentUser])

  const fetchDocuments = async (args: { parentId: string; lastRecord?: Document; skip?: number }) => {
    return fetchPaginationAPI<Document>({ ...args, seekAPI: apiSeekDocumentByTopic, offsetAPI: apiOffsetDocumentByTopic });
  }

  const { pages, onChangePage } = usePaginationState<Document>({
    keys: [topic._id],
    keyName: 'parentId',
    fetchFunction: fetchDocuments,
    filters: { field: 'createDate', asc: false }
  });

  const { mapTotalPages } = useTotalPagesState({ keys: [topic._id], keyName: 'parentId', api: apiCountDocumentsByTopic });

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
  // console.log('dataScenario: ', dataScenario, isEndLive);

  return (
    <div className="lesson-detail">
      {
        canPlayTopic({ topic, isJoinedCourse })
          ? <>
            {(topic._id === dataScenario?.topicId) ? (
              <div className={isFullScreen ? 'video-component-fullscreen video-commponent' : 'video-commponent'}>
                <Row className="video-live" gutter={{ md: 0, lg: 8, xl: 32 }}>
                  {(dataTimeCurrent >= dataScenario?.startTime) && !isEndLive && (
                    <Col xl={isFullScreen ? 24 : 16} md={isFullScreen ? 24 : 12} xs={24}>
                      {dataScenario?.endTime && dataTimeCurrent < dataScenario?.endTime ? (
                        <div className="streaming">
                          <StreamComponent dataTotalUser={dataTotalUser} dataScenario={new ScenarioInfo(dataScenario)} setIsEndLive={setIsEndLive} />
                        </div>
                      ) : (
                        <div className="video-scenario">
                          <ScenarioGame currentUser={currentUser} scenarioInfo={new ScenarioInfo(dataScenario)} />
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
                    </Col>
                  )}
                  {(dataTimeCurrent < dataScenario?.startTime) && dataScenario.endTime ? (
                    <Col xl={16} md={12} xs={24}>
                      <div className="waiting-live">
                        <div className="item_">
                          <img src={iconWaiting} alt="iconWaiting" />
                          <div className="count-down">
                            {moment.utc(countDown * 1000).format('HH:mm:ss')}
                          </div>
                          <div>LiveStream sẽ diễn ra vào lúc {moment(dataScenario?.startTime).format('HH:mm DD/MM/YYYY')}</div>
                        </div>
                      </div>
                    </Col>
                  ) : null}
                  {isEndLive && (
                    <Col xl={16} md={12} xs={24}>
                      <div className="waiting-live">
                        <div className="item_">
                          <img src={iconWaiting} alt="iconWaiting" />
                          <div>LiveStream đã kết thúc</div>
                        </div>
                      </div>
                    </Col>
                  )}
                  {(dataTimeCurrent < dataScenario?.startTime) && !dataScenario.endTime && (
                    <Col xl={16} md={12} xs={24}>
                      <div className="waiting-live">
                        <div className="item_">
                          <img src={iconWaiting} alt="iconWaiting" />
                          <div>Video sẽ có lúc {moment(dataScenario?.startTime).format('HH:mm DD/MM/YYYY')}</div>
                        </div>
                      </div>
                    </Col>
                  )}
                  {!isFullScreen && <Col xl={8} md={12} xs={24}>
                    <div className="comment">
                      <CommentPanel commentScope={CommentScopes.TOPIC} />
                    </div>
                  </Col>}
                  {topic.description && (
                    <Col xl={isFullScreen ? 24 : 16} md={isFullScreen ? 24 : 12} xs={24}>
                      <SanitizedDiv className="description" content={topic.description} />
                    </Col>
                  )}
                </Row>
              </div>
            ) : (
              <div className="video-component-fullscreen video-commponent">
                <Row gutter={{ md: 0, lg: 8, xl: 32 }}>
                  <Col xl={isFullScreen ? 24 : 16} md={isFullScreen ? 24 : 12} xs={24}>
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
                    </>}
                    {topic.description && <SanitizedDiv className="description" content={topic.description} />}
                  </Col>
                  {!isFullScreen && <Col xl={8} md={12} xs={24}>
                    <div className="comment">
                      <CommentPanel commentScope={CommentScopes.TOPIC} />
                    </div>
                  </Col>}
                </Row>
              </div>
            )}
            {/* </PanelContainer> */}
            <Row className="info-topic">
              <Col span={24} lg={16}>
                <div className="course-topic-tree">
                  <CourseTopicTreeView course={topic.course} />
                </div>
              </Col>
              <Col span={24} lg={8} className="info">
                <InformationCourse course={topic.course} />
              </Col>
            </Row>
          </>
          : <Row>
            <Col span={24} lg={16}>
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
            </Col>
            <Col span={24} lg={8}>
              <InformationCourse course={topic.course} />
            </Col>
          </Row>
      }
    </div >
  );
}

export default LessonInfoView;
