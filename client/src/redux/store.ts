import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import carSlice from "./features/carSlice";
import websiteSlice from "./features/websiteSlice";

const persistConfig = {
    key: "root",
    version: 1,
    storage,
    blacklist: ["car"],
    whitelist:['page']
  };

  const reducer = combineReducers({
    car: carSlice,
    page: websiteSlice
  })

  const persistedReducer = persistReducer(persistConfig,reducer)

  export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
  })

  // Need this in order to use useDipatch and useSelctor
export const Dispatch: () => typeof store.dispatch = useDispatch;
export const UseSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;