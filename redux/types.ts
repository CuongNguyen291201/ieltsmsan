export enum Scopes {
  CATEGORY,
  COURSE,
  TOPIC,
  PREPARE_GAME,
  COMMENT,
}

export const ActionTypes = {
  // COMMON
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  LOAD_LIST: 'LOAD_LIST',
  CREATE_ONE: 'CREATE_ONE',
  // CATEGORY
  CT_LOAD_CATEGORIES: 'CT_LOAD_CATEGORIES',
  // COURSE
  CRS_SET_CURRENT_COURSE: 'CRS_SET_CURRENT_COURSE',
  // TOPIC
  TP_FETCH_MAIN_TOPICS: 'TP_FETCH_MAIN_TOPICS',
  TP_SET_CURRENT_TOPIC: 'TP_SET_CURRENT_TOPIC',
  TP_UPDATE_TOPIC_DETAIL_EXERCISE: 'TP_UPDATE_TOPIC_DETAIL_EXERCISE',
  TP_SET_USER_CARD_DATA: 'TP_SET_USER_CARD_DATA',
  // PRE-GAME
  PRE_GAME_REVIEW_BOX: 'PRE_GAME_REVIEW_BOX',
  PRE_GAME_STATUS_PREPARE_REVIEW: 'PRE_GAME_STATUS_PREPARE_REVIEW',
  PRE_REVIEW_GAME: 'PRE_REVIEW_GAME',
  PRE_RESUME_GAME: 'PRE_RESUME_GAME',
  PRE_REVIEW_GAME_BOX: 'PRE_REVIEW_GAME_BOX',
  PRE_PLAY_GAME: 'PRE_PLAY_GAME',
  PRE_GO_TO_GAME: 'PRE_GO_TO_GAME',
  // COMMENT
  CMT_FETCH_COURSE_COMMENTS: 'CMT_FETCH_COURSE_COMMENTS',
  CMT_FETCH_TOPIC_COMMENTS: 'CMT_FETCH_TOPIC_COMMENTS',
  CMT_FETCH_REPLIES: 'CMT_FETCH_REPLIES',
  CMT_CREATE_COMMENT: 'CMT_CREATE_COMMENT',
  CMT_LOAD_REPLIES: 'CMT_LOAD_REPLIES',
  CMT_RESET_LIST: 'CMT_RESET_LIST'
}