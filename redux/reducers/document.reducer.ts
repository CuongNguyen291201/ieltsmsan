import Document from '../../sub_modules/share/model/document';
import { DocumentAction } from "../actions/document.action";
import { ActionTypes, Scopes } from "../types";

export interface TopicDocumentState {
  documentsList: Document[];
  documentPage: number;
  totalDocuments: number;
}

const initialState: TopicDocumentState = {
  documentsList: [],
  documentPage: 1,
  totalDocuments: 0
}

export const topicDocumentReducer = (state = initialState, action: DocumentAction): TopicDocumentState => {
  if (action.scope === Scopes.TOPIC_DOCUMENTS) {
    switch (action.type) {
      case ActionTypes.LOAD_LIST:
        return {
          ...state,
          documentsList: action.payload?.documentsList ?? [],
          totalDocuments: action.payload?.totalDocuments ?? state.totalDocuments
        }

      case ActionTypes.DOC_SET_DOCUMENT_PAGE:
        return {
          ...state,
          documentPage: action.payload?.documentPage ?? state.documentPage
        }
      default:
        return state;
    }
  }
  return state;
}
