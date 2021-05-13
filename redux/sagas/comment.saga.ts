import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import { apiCreateComment, apiSeekCommentsByCourse, apiSeekCommentsByTopic, apiSeekDiscussionsByParent } from '../../utils/apis/commentApi';
import { createOneAction, loadListAction } from '../actions';
import { CommentAction, loadRepliesAction } from '../actions/comment.action';
import { ActionTypes, Scopes } from '../types';

function* createComment(args: CommentAction) {
  const { data, status } = yield call(apiCreateComment, args.payload.comment);
  if (status === response_status_codes.success) {
    data.user = args.payload.user;
    yield put(createOneAction(Scopes.COMMENT, data));
  }
}

function* fetchCourseComments(args: CommentAction) {
  const { data, status } = yield call(apiSeekCommentsByCourse, args.payload);
  if (status === response_status_codes.success) {
    yield put(loadListAction(Scopes.COMMENT, data));
  }
}

function* fetchTopicComments(args: CommentAction) {
  const { data, status } = yield call(apiSeekCommentsByTopic, args.payload);
  if (status === response_status_codes.success) {
    yield put(loadListAction(Scopes.COMMENT, data));
  }
}

function* fetchReplies(args: CommentAction) {
  const { data, status } = yield call(apiSeekDiscussionsByParent, args.payload);
  if (status === response_status_codes.success) {
    yield put(loadRepliesAction({ parentId: args.payload.parentId, replies: data }));
  }
}

function* watchCreateComment() {
  yield takeLatest(ActionTypes.CMT_CREATE_COMMENT, createComment);
}

function* watchFetchCourseComments() {
  yield takeLatest(ActionTypes.CMT_FETCH_COURSE_COMMENTS, fetchCourseComments);
}

function* watchFetchTopicComments() {
  yield takeLatest(ActionTypes.CMT_FETCH_TOPIC_COMMENTS, fetchTopicComments);
}

function* watchFetchReplies() {
  yield takeLatest(ActionTypes.CMT_FETCH_REPLIES, fetchReplies);
}

export default function* commentSaga() {
  yield all([
    fork(watchCreateComment),
    fork(watchFetchCourseComments),
    fork(watchFetchTopicComments),
    fork(watchFetchReplies)
  ]);
}