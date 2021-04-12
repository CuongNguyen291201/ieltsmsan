import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { BaseAction, success } from '../actions';
import { ActionTypes, Scopes } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

function* setValueAsync(args: BaseAction) {
  yield delay(1000);
  yield put(success(Scopes.DEMO, args.payload));
}

export function* watchIncrementAsync() {
  yield takeEvery(ActionTypes.DEMO_SET_ASYNC, setValueAsync);
}

export default function* demoSaga() {
  yield all([fork(watchIncrementAsync)]);
}