import { all, fork } from 'redux-saga/effects';
import topicSaga from './topic.saga';
import commentSaga from './comment.saga';
import { documentModuleSaga } from '../../sub_modules/document/src/redux/saga'
function* rootSaga() {
  yield all([
    fork(topicSaga),
    fork(commentSaga),
    fork(documentModuleSaga)
  ]);
}

export default rootSaga;