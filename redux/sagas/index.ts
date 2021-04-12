import { all, fork } from 'redux-saga/effects';
import demoSaga from './demo.saga';

function* rootSaga() {
  yield all([
    fork(demoSaga)
  ]);
}

export default rootSaga;