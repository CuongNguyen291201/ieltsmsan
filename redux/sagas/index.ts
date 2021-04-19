import { all, fork } from 'redux-saga/effects';
import topicSaga from './topic.saga';

function* rootSaga() {
  yield all([
    fork(topicSaga)
  ]);
}

export default rootSaga;