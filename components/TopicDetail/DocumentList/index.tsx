import { Dialog, Tooltip, Pagination, Typography } from '@mui/material';
import { withStyles } from "@mui/styles"
import { HighlightOff } from '@mui/icons-material';
import { PropsWithoutRef, useEffect, useMemo, useReducer } from 'react';
import DocViewer, { DocViewerRenderers, ImageProxyRenderer, JPGRenderer, MSDocRenderer, PDFRenderer, PNGRenderer } from 'react-doc-viewer';
import { apiCountDocumentsByTopic, apiOffsetDocumentsByTopic } from '../../../utils/apis/documentApi';
import SingleFileDocIcon from '../../../public/images/icons/SingleFileDocIcon.svg';
import ArchiveFileDocIcon from '../../../public/images/icons/ArchiveFileDocIcon.svg';
import {
  documentsListInitState,
  documentsListReducer,
  downloadDocument,
  downloadSingleFile,
  getFileMimeType,
  setDocumentPage,
  setDocumentsList,
  setOpenDocumentItems,
  setPreviewUrl
} from './documentList.reducer';
import './style.scss';

const DOCUMENT_LOAD_LIMIT = 20;

const DocumentsList = (props: PropsWithoutRef<{ topicId: string; hideTitle?: boolean }>) => {
  const { topicId, hideTitle } = props;
  const [{
    documentsList,
    documentPage,
    totalDocuments,
    mapStateOpen,
    previewUrl,
    documentTitle
  }, uiLogic] = useReducer(documentsListReducer, documentsListInitState);

  const totalPages = useMemo(() => {
    return Math.ceil((totalDocuments || 1) / DOCUMENT_LOAD_LIMIT);
  }, [totalDocuments]);

  useEffect(() => {
    Promise.all([
      apiCountDocumentsByTopic(topicId),
      apiOffsetDocumentsByTopic({ skip: 0, field: 'createDate', parentId: topicId, limit: DOCUMENT_LOAD_LIMIT })
    ])
      .then(([{ total }, documentsList]) => {
        uiLogic(setDocumentsList(documentsList, total));
      });
  }, [topicId]);

  const onChangePage = (page: number) => {
    apiOffsetDocumentsByTopic({ skip: (page - 1) * DOCUMENT_LOAD_LIMIT, field: 'createDate', parentId: topicId, limit: DOCUMENT_LOAD_LIMIT })
      .then((documentsList) => {
        uiLogic(setDocumentsList(documentsList));
        uiLogic(setDocumentPage(page));
      })
  }

  const PreviewDialog = withStyles((theme) => ({
    paper: {
      height: "90vh",
    },
  }))(Dialog);

  const renderPreviewModal = () => {
    const fileType = getFileMimeType(previewUrl);
    return (
      <PreviewDialog
        open={!!previewUrl}
        onClose={() => { uiLogic(setPreviewUrl('')) }}
        fullWidth
        maxWidth="lg"
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span style={{ cursor: "pointer" }} onClick={() => { uiLogic(setPreviewUrl('')) }}>
            <HighlightOff style={{ margin: "10px" }} />
          </span>
        </div>
        {fileType
          ? <DocViewer
            documents={[{ uri: previewUrl, fileType: getFileMimeType(previewUrl) }]}
            pluginRenderers={[...DocViewerRenderers, MSDocRenderer, ImageProxyRenderer, PDFRenderer, PNGRenderer, JPGRenderer]}
            style={{ height: "100%", width: "100%" }}
            config={{
              header: {
                overrideComponent: (state, prevDoc, nextDoc) => {
                  return <Typography sx={{ backgroundColor: "#fff", paddingLeft: "16px" }}>{documentTitle}</Typography>
                }
              }
            }}
          />
          : <div>File không được hỗ trợ</div>
        }
      </PreviewDialog>
    )
  }

  return (
    <>
      <div id="topic-documents-view" className="document-list">
        {!!documentsList.length && !hideTitle && <div><h2 className="title">Tài liệu tham khảo</h2></div>}
        {documentsList.map((e) => (
          <div key={e._id} className="document-wrap">
            <div className="document">
              <div className="document-item-parent">
                {e.items.length > 1
                  ? <span className="document-icon">
                    <img src={ArchiveFileDocIcon} alt={e.title} />
                  </span>
                  : <span className="document-icon">
                    <img src={SingleFileDocIcon} alt={e.title} />
                  </span>}
                <span className="document-name">{e.title}</span>
              </div>

              <div className="document-addons">
                <Tooltip title="Xem chi tiết" arrow>
                  {e.items.length > 1
                    ? <i className={`fas fa-chevron-down doc-parent${mapStateOpen[e._id] ? ' doc-open' : ''}`} onClick={() => {
                      uiLogic(setOpenDocumentItems(e._id, !mapStateOpen[e._id]));
                    }} />
                    : <i className="far fa-eye" onClick={() => {
                      uiLogic(setPreviewUrl(e.itemsDetail[0] ? e.itemsDetail[0].url : '', e.title))
                    }} />}
                </Tooltip>
                <Tooltip title="Tải xuống" arrow>
                  <i className="far fa-download" onClick={() => { downloadDocument(e); }} />
                </Tooltip>
              </div>
            </div>

            {mapStateOpen[e._id] && <div className="document-items">
              {(e.itemsDetail || []).map((_e, i) => (
                <div key={_e._id} className="document-items-detail">
                  <div className="document-items-detail-name">
                    <span className="document-icon">
                      <img src={SingleFileDocIcon} alt={`${e.title}_${i + 1}`} />
                    </span>
                    {_e.name || `${e.title}_${i + 1}`}
                  </div>

                  <div className="document-items-detail-addons">
                    <Tooltip title="Xem chi tiết" arrow>
                      <i className="far fa-eye" onClick={() => { uiLogic(setPreviewUrl(_e.url, `${e.title}_${i + 1}`)) }} />
                    </Tooltip>
                    <Tooltip title="Tải xuống" arrow>
                      <i className="far fa-download" onClick={() => { downloadSingleFile(`${e.title}_${i + 1}`, _e.url); }} />
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>}
          </div>
        ))}

        {totalPages > 1 && <Pagination className="pagination" count={totalPages} page={documentPage} variant="outlined" shape="rounded" onChange={(e, page) => {
          e.preventDefault();
          onChangePage(page);
        }} />}
      </div>
      {renderPreviewModal()}
    </>
  )
}

export default DocumentsList;
