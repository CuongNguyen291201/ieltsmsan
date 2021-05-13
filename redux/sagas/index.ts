import { all, fork } from 'redux-saga/effects';
import topicSaga from './topic.saga';
import commentSaga from './comment.saga';

function* rootSaga() {
  yield all([
    fork(topicSaga),
    fork(commentSaga)
  ]);
}

export default rootSaga;