export enum Scopes {
  CATEGORY,
  COURSE,
  TOPIC
}

export const ActionTypes = {
  // COMMON
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  LOAD_LIST: 'LOAD_LIST',
  // CATEGORY
  CT_LOAD_CATEGORIES: 'CT_LOAD_CATEGORIES',
  // COURSE
  CRS_SET_CURRENT_COURSE: 'CRS_SET_CURRENT_COURSE',
  // TOPIC
  TP_FETCH_MAIN_TOPICS: 'TP_FETCH_MAIN_TOPICS'
}