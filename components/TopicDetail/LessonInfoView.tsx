import router from 'next/router';
import { useDispatch } from 'react-redux';
import { usePaginationState } from '../../hooks/pagination';
import { fetchPaginationAPI } from '../../utils/apis/common';
import { apiOffsetDocumentByTopic, apiSeekDocumentByTopic } from '../../utils/apis/documentApi';
import PanelContainer from '../containers/PanelContainer';
import './lesson-info.scss';

const LessonInfoView = (props: { topic: any }) => {
  const { topic } = props;
  const fetchDocuments = async (args: { parentId: string; lastRecord?: any; skip?: number }) => {
    return fetchPaginationAPI<any>({ ...args, seekAPI: apiSeekDocumentByTopic, offsetAPI: apiOffsetDocumentByTopic });
  }
  const dispatch = useDispatch();

  const { pages, onChangePage } = usePaginationState<any>({ keys: [topic._id], keyName: 'parentId', fetchFunction: fetchDocuments });

  return (
    <div className="lesson-detail">
      <PanelContainer title="Mô tả">
        <div className="description" dangerouslySetInnerHTML={{ __html: topic.description }} />
      </PanelContainer>

      <PanelContainer title="Tài liệu tham khảo">
        {pages[topic._id]?.data[pages[topic._id].currentPage]?.map((e, i) => (
          <div key={i} className="doc-container">
            <div className="file-title">
              <i className="fas fa-file-pdf" />
              <div className="doc-title" onClick={() => router.push(e.itemsDetail[0].url)}>{e.title}</div>
            </div>

          </div>
        ))}
      </PanelContainer>

      <PanelContainer title="Hoạt động gần đây">

      </PanelContainer>

      <PanelContainer title="Bình luận">

      </PanelContainer>

    </div>
  );
}

export default LessonInfoView;
