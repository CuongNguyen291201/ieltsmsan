export enum Scopes {
  CATEGORY,
  COURSE,
  TOPIC,
  PREPARE_GAME,
  COMMENT,
  CART,
  EXAM,
  TOPIC_DOCUMENTS,
  CONTENT
}

export const ActionTypes = {
  // COMMON
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  LOAD_LIST: 'LOAD_LIST',
  CREATE_ONE: 'CREATE_ONE',
  REMOVE_ONE: 'REMOVE_ONE',
  // CATEGORY
  CT_LOAD_CATEGORIES: 'CT_LOAD_CATEGORIES',
  CT_SET_CURENTT_CATEGORY: 'CT_SET_CURENTT_CATEGORY',
  // COURSE
  CRS_SET_CURRENT_COURSE: 'CRS_SET_CURRENT_COURSE',
  CRS_SET_ORDER_COURSE: 'CRS_SET_ORDER_COURSE',
  CRS_REMOVE_ORDER_COURSE: 'CRS_REMOVE_ORDER_COURSE',
  CRS_SET_USER_COURSE: 'CRS_SET_USER_COURSE',
  CRS_SET_ACTIVE_MODAL_VISIBLE: 'CRS_SET_ACTIVE_MODAL_VISIBLE',
  CRS_SET_USER_COURSE_LOADING: 'CRS_SET_USER_COURSE_LOADING',
  // TOPIC
  TP_FETCH_MAIN_TOPICS: 'TP_FETCH_MAIN_TOPICS',
  TP_SET_CURRENT_TOPIC: 'TP_SET_CURRENT_TOPIC',
  TP_UPDATE_TOPIC_DETAIL_EXERCISE: 'TP_UPDATE_TOPIC_DETAIL_EXERCISE',
  TP_SET_USER_CARD_DATA: 'TP_SET_USER_CARD_DATA',
  TP_FETCH_TOPICS: 'TP_FETCH_TOPICS',
  TP_SET_LOAD_MORE_CHILD_TOPICS: 'TP_SET_LOAD_MORE_CHILD_TOPICS',
  TP_RESET_TOPICS_LIST: 'TP_RESET_TOPICS_LIST',
  TP_FETCH_SECTIONS: 'TP_FETCH_SECTIONS',
  // TOPIC_DOCUMENTS
  DOC_SET_DOCUMENTS_LIST: 'doc/SET_DOCUMENTS_LIST',
  DOC_SET_TOTAL_DOCUMENTS: 'doc/SET_TOTAL_DOCUMENTS',
  DOC_SET_DOCUMENT_PAGE: 'doc/SET_DOCUMENT_PAGE',
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
  CMT_RESET_LIST: 'CMT_RESET_LIST',
  // EXAM
  EXAM_SET_MAP_SKILL_TYPE_VALUES: 'EXAM_SET_MAP_SKILL_TYPE_VALUES',
  EXAM_SET_EXERCISE_OPTIONS: 'EXAM_SET_EXERCISE_OPTIONS',
  // CONTENT
  CONTENT_SET_HEADINGS_DATA: 'CONTENT_SET_HEADINGS_DATA'
}