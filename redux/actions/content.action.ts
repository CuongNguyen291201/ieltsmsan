import { BaseAction } from ".";
import HeadingData from "../../custom-types/HeadingData";
import { ActionTypes, Scopes } from "../types";

export interface ContentAction extends BaseAction {
  scope: typeof Scopes.CONTENT;
  payload?: {
    headings?: Array<HeadingData & { items?: Array<HeadingData> }>
  }
}

export const setHeadingsDataAction = (headings: Array<HeadingData & { items?: Array<HeadingData> }>): ContentAction => ({
  scope: Scopes.CONTENT, type: ActionTypes.CONTENT_SET_HEADINGS_DATA, payload: { headings }
});
