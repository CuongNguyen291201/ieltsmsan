import HeadingData from "../../custom-types/HeadingData";
import { ContentAction } from "../actions/content.action";
import { ActionTypes, Scopes } from "../types";

export interface ContentState {
  headings: Array<HeadingData & { items?: Array<HeadingData> }>
}

const initialState: ContentState = {
  headings: []
}

export const contentReducer = (state = initialState, action: ContentAction): ContentState => {
  if (action.scope === Scopes.CONTENT) {
    switch (action.type) {
      case ActionTypes.CONTENT_SET_HEADINGS_DATA:
        return {
          ...state, 
          headings: action.payload?.headings ?? []
        }

      default:
        return state;
    }
  }
  return state;
}
