import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import { apiGetTopicsByParentId } from '../../utils/apis/topicApi';
import { failureAction, loadListAction } from '../actions';
import { TopicAction } from '../actions/topic.action';
import { ActionTypes, Scopes } from '../types';

function* fetchTopics(args: TopicAction) {
  const { data, status } = yield call(apiGetTopicsByParentId, args.payload);
  if (status === response_status_codes.success) {
    yield put(loadListAction(Scopes.TOPIC, data, 'mainTopics'));
  } else {
    yield put(failureAction(Scopes.TOPIC));
  }
}

function* watchOnFetchTopics() {
  yield takeEvery(ActionTypes.TP_FETCH_MAIN_TOPICS, fetchTopics);
}

export default function* topicSaga() {
  yield all([
    fork(watchOnFetchTopics)
  ]);
}

