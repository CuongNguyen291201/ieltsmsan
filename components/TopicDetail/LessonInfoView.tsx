import { useRef } from 'react';
import { CommentScopes } from '../../custom-types';
import { usePaginationState, useTotalPagesState } from '../../hooks/pagination';
import Document from '../../sub_modules/share/model/document';
import Topic from '../../sub_modules/share/model/topic';
import { downloadFromURL } from '../../utils';
import { fetchPaginationAPI } from '../../utils/apis/common';
import { apiCountDocumentsByTopic, apiOffsetDocumentByTopic, apiSeekDocumentByTopic } from '../../utils/apis/documentApi';
import CommentPanel from '../CommentPanel';
import PanelContainer from '../containers/PanelContainer';
import Pagination from '../Pagination';
import './lesson-info.scss';

const LessonInfoView = (props: { topic: Topic }) => {
  const { topic } = props;

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

  return (
    <div className="lesson-detail">
      <PanelContainer title="Mô tả">
        <div className="description" dangerouslySetInnerHTML={{ __html: topic.description }} />
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

      <PanelContainer title="Hoạt động gần đây">

      </PanelContainer>
    </div>
  );
}

export default LessonInfoView;
