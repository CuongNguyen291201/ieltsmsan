import { BaseAction } from ".";
import Document from "../../sub_modules/share/model/document";
import { ActionTypes, Scopes } from "../types";

export interface DocumentAction extends BaseAction {
  scope: typeof Scopes.TOPIC_DOCUMENTS;
  payload?: {
    documentsList?: Document[];
    documentPage?: number;
    totalDocuments?: number;
  }
}

export const setDocumentPageAction = (documentPage: number): DocumentAction => ({
  scope: Scopes.TOPIC_DOCUMENTS, type: ActionTypes.DOC_SET_DOCUMENT_PAGE, payload: { documentPage }
});

export const setDocumentsListAction = (documentsList: Document[], totalDocuments?: number): DocumentAction => ({
  scope: Scopes.TOPIC_DOCUMENTS, type: ActionTypes.LOAD_LIST, payload: { documentsList, totalDocuments }
});
