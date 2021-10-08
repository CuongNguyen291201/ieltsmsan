import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Col, Row } from 'antd';
import { usePaginationState, useTotalPagesState } from '../../hooks/pagination';
import { AppState } from '../../redux/reducers';
import Document from '../../sub_modules/share/model/document';
import ScenarioInfo from '../../sub_modules/share/model/scenarioInfo';
import Topic from '../../sub_modules/share/model/topic';
import { downloadFromURL } from '../../utils';
import { fetchPaginationAPI } from '../../utils/apis/common';
import { apiCountDocumentsByTopic, apiOffsetDocumentByTopic, apiSeekDocumentByTopic } from '../../utils/apis/documentApi';
import { apiUpdateTopicProgress, getOneVideoScenarioAPI } from '../../utils/apis/topicApi';
import PanelContainer from '../containers/PanelContainer';
import Pagination from '../Pagination';
import StreamComponent from '../Stream';
import './lesson-info.scss';
import LessonVideoView from './LessonVideoView';
import scenario from './scenario.json';
import CommentPanel from '../CommentPanelNew';
import { CommentScopes } from '../../custom-types';

const ScenarioGame = dynamic(() => import('../../sub_modules/scenario/src/main/ScenarioGame'), { ssr: false })


const LessonInfoView = (props: { topic: Topic }) => {
  const { topic } = props;
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const [dataScenario, setDataScenario] = useState<ScenarioInfo>();

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

  return (
    <div className="lesson-detail">
      <PanelContainer title="Mô tả">
        <div className="description" dangerouslySetInnerHTML={{ __html: topic.description }} />
        {!!topic.videoUrl && <LessonVideoView topic={topic} />}
      </PanelContainer>

      <PanelContainer title="Nội dung">
        {topic._id === dataScenario?.topicId &&
          <div className="video-commponent">
            {dataScenario?.endTime ? (
              <Row gutter={{ md: 0, lg: 8, xl: 32 }}>
                <Col xl={16} md={12} xs={24}>
                  <div className="streaming">
                    <StreamComponent dataScenario={new ScenarioInfo(dataScenario)} />
                  </div>
                </Col>
                <Col xl={8} md={12} xs={24}>
                  <div className="comment">
                    <CommentPanel commentScope={CommentScopes.TOPIC} />
                  </div>
                </Col>
              </Row>
            ) : (
              <div className="scenario-video">
                <ScenarioGame currentUser={currentUser} scenarioInfo={new ScenarioInfo(dataScenario)} />
              </div>
            )}
          </div>
        }
      </PanelContainer>

      <PanelContainer title="Tài liệu tham khảo">
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
      </PanelContainer>
    </div>
  );
}

export default LessonInfoView;
