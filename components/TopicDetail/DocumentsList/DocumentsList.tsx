import { HighlightOff } from '@mui/icons-material';
import { Box, Dialog, Pagination, Tooltip, Typography } from '@mui/material';
import { withStyles } from "@mui/styles";
import { PropsWithoutRef, useMemo, useReducer } from 'react';
import DocViewer, { DocViewerRenderers, ImageProxyRenderer, JPGRenderer, MSDocRenderer, PDFRenderer, PNGRenderer } from 'react-doc-viewer';
import ArchiveFileDocIcon from '../../../public/images/icons/ArchiveFileDocIcon.svg';
import SingleFileDocIcon from '../../../public/images/icons/SingleFileDocIcon.svg';
import Document from "../../../sub_modules/share/model/document";
import {
  documentsListInitState,
  documentsListReducer,
  downloadDocument,
  downloadSingleFile,
  getFileMimeType,
  setOpenDocumentItems,
  setPreviewUrl
} from './documentsList.reducer';
import './style.scss';


const DocumentsList = (props: PropsWithoutRef<{
  documentsList?: Document[];
  totalDocuments?: number;
  documentPage?: number;
  onChangePage?: (page: number) => void;
  pageSize?: number;
}>) => {
  const { documentsList = [], totalDocuments = 0, documentPage = 1, onChangePage = () => { }, pageSize = 20 } = props;
  const [{
    mapStateOpen,
    previewUrl,
    documentTitle
  }, uiLogic] = useReducer(documentsListReducer, documentsListInitState);

  const totalPages = useMemo(() => {
    return Math.ceil((totalDocuments || 1) / (pageSize || 20));
  }, [totalDocuments, pageSize]);

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
            <HighlightOff style={{ marginTop: "10px", marginRight: "10px" }} />
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
                  return <Typography sx={{ backgroundColor: "#fff", paddingLeft: "16px" }}><h3 style={{ margin: 0 }}>{documentTitle}</h3></Typography>
                }
              }
            }}
          />
          : <div>File không được hỗ trợ</div>
        }
        <Box sx={{ position: "absolute", bottom: "0", zIndex: 999, width: "100%", height: "24px" }} />
      </PreviewDialog>
    )
  }

  return (
    <>
      <div id="topic-documents-view" className="document-list">
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
