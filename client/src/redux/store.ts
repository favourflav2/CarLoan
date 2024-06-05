import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import carSlice from "./features/carSlice";
import carStateSlice from "./features/carStateSlice";
import applicationSlice from "./features/applicationSlice";
import retirementSlice from "./features/modalSlices/retirementSlice";
import carModalSlice from "./features/modalSlices/carModalSlice";
import houseSlice from "./features/modalSlices/houseSlice";
import authSlice from "./features/authSlice";

import tablesSlice from "./features/tablesSlice";
import { listenerMiddleware } from "./listeners/listenerMiddleware";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["car","tableSlice"],
  //whitelist: ["page", "app", "retireSlice", "carModalSlice"],
};


const reducer = combineReducers({
  car: carSlice,
  page: carStateSlice,
  app: applicationSlice,
  retireSlice: retirementSlice,
  carModalSlice: carModalSlice,
  houseSlice: houseSlice,
  auth: authSlice,
  tableSlice:tablesSlice
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Need this in order to use useDipatch and useSelctor
export const Dispatch = useDispatch.withTypes<AppDispatch>();
export const UseSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;




// // "logIn/fulfilled"




// export const Dispatch: () => typeof store.dispatch = useDispatch;
// export const UseSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;
