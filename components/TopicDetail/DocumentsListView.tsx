import { Box } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { setDocumentPageAction, setDocumentsListAction } from "../../redux/actions/document.action";
import { AppState } from "../../redux/reducers"
import { apiCountDocumentsByTopic, apiOffsetDocumentsByTopic } from "../../utils/apis/documentApi";
import { canPlayTopic } from "../../utils/permission/topic.permission";
import DocumentsList from "./DocumentsList/DocumentsList";
import useTopicContentStyles from "./useTopicContentStyles";

const DOCUMENT_LOAD_LIMIT = 20;

const DocumentsListView = () => {
  const topic = useSelector((state: AppState) => state.topicReducer.currentTopic);
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser);
  const isJoinedCourse = useSelector((state: AppState) => state.courseReducer.isJoinedCourse);
  const { documentsList, documentPage, totalDocuments } = useSelector((state: AppState) => state.topicDocumentReducer);
  const classes = useTopicContentStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!!topic && !!currentUser && canPlayTopic({ topic, isJoinedCourse })) {
      Promise.all([
        apiCountDocumentsByTopic(topic._id),
        apiOffsetDocumentsByTopic({ skip: 0, field: "createDate", parentId: topic._id, limit: DOCUMENT_LOAD_LIMIT })
      ])
        .then(([{ total }, documentsList]) => {
          dispatch(setDocumentsListAction(documentsList, total));
        })
    }
  }, [currentUser, topic, isJoinedCourse]);

  const onChangeDocumentPage = (page: number) => {
    apiOffsetDocumentsByTopic({ skip: (page - 1) * DOCUMENT_LOAD_LIMIT, field: "createDate", parentId: topic._id, limit: DOCUMENT_LOAD_LIMIT })
      .then((documentsList) => {
        dispatch(setDocumentsListAction(documentsList));
        dispatch(setDocumentPageAction(page));
      })
  }

  return !!totalDocuments && <Box className={classes.sectionPanelBorder}>
    <h2>Tài liệu tham khảo</h2>
    <DocumentsList
      documentsList={documentsList}
      totalDocuments={totalDocuments}
      documentPage={documentPage}
      pageSize={DOCUMENT_LOAD_LIMIT}
      onChangePage={onChangeDocumentPage}
    />
  </Box>
}

export default DocumentsListView;
