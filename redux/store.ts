import { createStore, AnyAction, applyMiddleware, Store } from 'redux';
import { Context, createWrapper, HYDRATE, MakeStore } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware, { SagaMiddleware, Task } from 'redux-saga';

import rootSaga from './sagas';
import { rootReducer, AppState } from './reducers';

export interface SagaStore extends Store {
  sagaTask?: Task;
}

const bindMiddlewares = (middlewares: Array<SagaMiddleware>) => {
  if (process.env.NODE_ENV !== 'production') {
    return composeWithDevTools(applyMiddleware(...middlewares));
  }
  return applyMiddleware(...middlewares);
}

const reducers = (state: AppState, action: AnyAction) => {
  if (action.type === HYDRATE) {
    return {
      ...state,
      ...action.payload
    }
  }
  return rootReducer(state, action);
}

const makeStore: MakeStore<AppState> = (context: Context) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore<AppState, AnyAction, any, any>(reducers, bindMiddlewares([sagaMiddleware]));
  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);
  return store;
}

export const wrapper = createWrapper<AppState>(makeStore, { debug: false });