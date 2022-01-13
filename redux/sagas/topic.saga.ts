import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { response_status } from '../../sub_modules/share/api_services/http_status';
import { apiGetCourseSections, apiOffsetTopicsByParentId } from '../../utils/apis/topicApi';
import { failureAction, loadListAction } from '../actions';
import { TopicAction } from '../actions/topic.action';
import { ActionTypes, Scopes } from '../types';

function* fetchTopics(args: TopicAction) {
  const { data, status } = yield call(apiOffsetTopicsByParentId, args.payload);
  if (status === response_status.success) {
    if (!args.payload.parentId) {
      yield put(loadListAction(Scopes.TOPIC, { data, limit: args.payload?.limit ?? 20 }));
    }
  } else {
    yield put(failureAction(Scopes.TOPIC));
  }
}

function* watchOnFetchTopics() {
  yield takeLatest(ActionTypes.TP_FETCH_TOPICS, fetchTopics);
}

function* fetchSections(args: TopicAction) {
  const data = yield call(apiGetCourseSections, args.payload);
  yield put(loadListAction(Scopes.TOPIC, { data }));
}

function* watchOnFetchSections() {
  yield takeLatest(ActionTypes.TP_FETCH_SECTIONS, fetchSections);
}

export default function* topicSaga() {
  yield all([
    fork(watchOnFetchTopics),
    fork(watchOnFetchSections)
  ]);
}

