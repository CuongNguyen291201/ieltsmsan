import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
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
import viewHideComment from '../../public/default/viewHideComment.svg'
const ScenarioGame = dynamic(() => import('../../sub_modules/scenario/src/main/ScenarioGame'), { ssr: false })


const LessonInfoView = (props: { topic: Topic }) => {
  const { topic } = props;
  const firebaseInstance = useRealtime();
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const [dataScenario, setDataScenario] = useState<ScenarioInfo>();
  const [dataTotalUser, setDataTotalUser] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [dataTimeCurrent, setDataTimeCurrent] = useState(0);

  useEffect(() => {
    timeStamp()
  }, [])

  useEffect(() => {
    if (currentUser && topic._id) {
      firebaseInstance.realtimeDb.ref().child(`count-users-live-stream-${topic._id}`).on("value", (snapshot) => {
        setDataTotalUser((snapshot?.val() && Object.values(snapshot?.val())?.length) ?? 0)
      })
      firebaseInstance.realtimeDb.ref().child(`count-users-live-stream-${topic._id}`).child(`${currentUser._id}`).set(`${currentUser.name}`)
      firebaseInstance.realtimeDb.ref().child(`count-users-live-stream-${topic._id}`).child(`${currentUser._id}`).onDisconnect().remove()
    }
  }, [topic])
  const timeStamp = async () => {
    const dataTime = await apiGetTimeStamp({})
    setDataTimeCurrent(dataTime.timeStamp ?? moment().valueOf())
  }
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
  useEffect(() => {
    if (!currentUser) return;
    if (!topic.videoUrl) {
      apiUpdateTopicProgress({
        topicId: topic._id, userId: currentUser._id, progress: 100
      });
    }
    if (topic?._id) {
      fetchDataScenario()
    }
  }, [currentUser]);

  const fetchDataScenario = async () => {
    const dataArrTemp = await getOneVideoScenarioAPI({ topicId: topic?._id })
    setDataScenario(dataArrTemp?.scenarioInfos?.[0] ?? [])
  }
  console.log('dataScenario: ', dataScenario);
  const fullScreen = () => {
    setIsFullScreen(true)
  }
  return (
    <div className="lesson-detail">
      {/* <PanelContainer title="Mô tả">
        <div className="description" dangerouslySetInnerHTML={{ __html: topic.description }} />
        {!!topic.videoUrl && <LessonVideoView topic={topic} />}
      </PanelContainer> */}

      {/* <PanelContainer title="Nội dung"> */}
      {(topic._id === dataScenario?.topicId) && (dataTimeCurrent >= dataScenario?.startTime) &&
        <div className={isFullScreen ? 'video-component-fullscreen video-commponent' : 'video-commponent'}>
          {/* {dataScenario?.endTime ? ( */}
          <Row className="video-live" gutter={{ md: 0, lg: 8, xl: 32 }}>
            <Col xl={isFullScreen ? 24 : 16} md={isFullScreen ? 24 : 12} xs={24}>
              {dataScenario?.endTime && dataTimeCurrent < dataScenario?.endTime ? (
                <div className="streaming">
                  <StreamComponent dataTotalUser={dataTotalUser} dataScenario={new ScenarioInfo(dataScenario)} dataTimeCurrent={dataTimeCurrent} />
                </div>
              ) : (
                <div className="video-scenario">
                  <ScenarioGame currentUser={currentUser} scenarioInfo={new ScenarioInfo(dataScenario)} />
                </div>
              )}

              <div className="view-mode">Chế độ xem : <span onClick={() => setIsFullScreen(true)}><img src={viewHideComment} alt="viewHideComment" /></span><span onClick={() => setIsFullScreen(false)}><img src={twoScreen} alt="twoScreen" /></span></div>
            </Col>
            {!isFullScreen && <Col xl={8} md={12} xs={24}>
              <div className="comment">
                <CommentPanel commentScope={CommentScopes.TOPIC} />
              </div>
            </Col>}

          </Row>
          {/* ) : (
              <div className="scenario-video">
                <ScenarioGame currentUser={currentUser} scenarioInfo={new ScenarioInfo(dataScenario)} />
              </div>
            )} */}
        </div>
      }
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
