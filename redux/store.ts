import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { rootReducer, AppState as _AppState } from "./reducers";
import rootSaga from "./sagas";
import createSagaMiddleware from "@redux-saga/core";

const sagaMiddleware = createSagaMiddleware()

const reducer = (state: _AppState, action: any) => {
  if (action.type === HYDRATE) {
    return {
      ...state,
      ...action.payload
    }
  }
  return rootReducer(state, action);
}

const store: EnhancedStore<_AppState, any> = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    }).concat(sagaMiddleware);
  }
});

sagaMiddleware.run(rootSaga);

const makeStore = () => {
  return store;
}

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const wrapper = createWrapper<_AppState>(makeStore, { debug: false });
