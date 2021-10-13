import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Col, Row } from 'antd';
import moment from 'moment';
import { usePaginationState, useTotalPagesState } from '../../hooks/pagination';
import { useRealtime } from "../../sub_modules/firebase/src/FirebaseContext";
import { AppState } from '../../redux/reducers';
import Document from '../../sub_modules/share/model/document';
import ScenarioInfo from '../../sub_modules/share/model/scenarioInfo';
import Topic from '../../sub_modules/share/model/topic';
import { downloadFromURL } from '../../utils';
import { fetchPaginationAPI } from '../../utils/apis/common';
import { apiCountDocumentsByTopic, apiOffsetDocumentByTopic, apiSeekDocumentByTopic } from '../../utils/apis/documentApi';
import { apiUpdateTopicProgress, getOneVideoScenarioAPI, apiGetTimeStamp } from '../../utils/apis/topicApi';
import PanelContainer from '../containers/PanelContainer';
import Pagination from '../Pagination';
import StreamComponent from '../Stream';
import './lesson-info.scss';
import LessonVideoView from './LessonVideoView';
import scenario from './scenario.json';
import CommentPanel from '../CommentPanelNew';
import { CommentScopes } from '../../custom-types';
import { Course } from '../../sub_modules/share/model/courses';
import CourseContentView from '../CourseDetail/CourseContentView';
import { ContentCourse } from '../CourseDetail/content-course';
import { InformationCourse } from '../CourseDetail/InformationCourse/information-course';
import CourseTopicTreeView from '../CourseDetail/CourseTopicTreeView';
import twoScreen from '../../public/default/twoScreen.svg'
import iconWaiting from '../../public/default/waiting-live.svg'
import viewHideComment from '../../public/default/viewHideComment.svg'
import registerServiceWorker, { countDownTimer, clearCountDown, unregister } from '../ServiceWorker/registerServiceWorker';
import SanitizedDiv from '../SanitizedDiv';
const ScenarioGame = dynamic(() => import('../../sub_modules/scenario/src/main/ScenarioGame'), { ssr: false })


const LessonInfoView = (props: { topic: Topic }) => {
  const { topic } = props;
  const refCountDown = useRef<any>();
  const firebaseInstance = useRealtime();
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const [dataScenario, setDataScenario] = useState<ScenarioInfo>();
  const [dataTotalUser, setDataTotalUser] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [dataTimeCurrent, setDataTimeCurrent] = useState(0);
  const [isEndLive, setIsEndLive] = useState(false)
  const [countDown, setCountDown] = useState(0);

  useEffect(() => {
    return () => {
      clearCountDown();
      unregister();
    }
  }, []);

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
  }, [topic, dataTimeCurrent, dataScenario])

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
        setCountDown(_time)
      })
    }
    setDataScenario(dataScenarioTemp)
  }
  // console.log('dataScenario: ', dataScenario, isEndLive);

  return (
    <div className="lesson-detail">
      {/* <PanelContainer title="Mô tả">
        <div className="description" dangerouslySetInnerHTML={{ __html: topic.description }} />
        {!!topic.videoUrl && <LessonVideoView topic={topic} />}
      </PanelContainer> */}

      {/* <PanelContainer title="Nội dung"> */}
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
          <Row className="video-live" gutter={{ md: 0, lg: 8, xl: 32 }}>
            <Col xl={24} md={24} xs={24}>
              <div className="waiting-live" style={{ height: '400px' }}>
                <div className="item_">
                  <img src={iconWaiting} alt="iconWaiting" />
                  <div>Chưa có video nào</div>
                </div>
              </div>
            </Col>
          </Row>
          {topic.description && <SanitizedDiv className="description" content={topic.description} />}
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
      {/* <PanelContainer title="Tài liệu tham khảo">
        {pages[topic._id]?.data[pages[topic._id].currentPage]?.map((e, i) => (
          <div key={i} className="doc-container">
            <div className="file-title">
              <i className="far fa-file-pdf file-type-icon" />
              <div className="doc-title" onClick={() => downloadFromURL(e.itemsDetail[0].url, e.itemsDetail[0].type, e.title)}> {e.title} </div>
            </div>

            <i className="far fa-download download-icon" onClick={() => downloadFromURL(e.itemsDetail[0].url, e.itemsDetail[0].type, e.title)} />
          </div>
        ))}

        {(mapTotalPages[topic._id] || 0) > 1 && <div className="item-pagination">
          <Pagination
            total={mapTotalPages[topic._id]}
            active={pages[topic._id]?.currentPage}
            start={1}
            onClick={(page) => onChangePage({ page, key: topic._id })}
          />
        </div>}
      </PanelContainer> */}
    </div>
  );
}

export default LessonInfoView;
