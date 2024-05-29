import { configureStore, combineReducers, createListenerMiddleware } from "@reduxjs/toolkit";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import carSlice from "./features/carSlice";
import carStateSlice from "./features/carStateSlice";
import applicationSlice from "./features/applicationSlice";
import retirementSlice from "./features/modalSlices/retirementSlice";
import carModalSlice from "./features/modalSlices/carModalSlice";
import houseSlice from "./features/modalSlices/houseSlice";
import authSlice, { setPrac } from "./features/authSlice";


const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["car"],
  //whitelist: ["page", "app", "retireSlice", "carModalSlice"],
};

const listenerMiddleware = createListenerMiddleware()

const reducer = combineReducers({
  car: carSlice,
  page: carStateSlice,
  app: applicationSlice,
  retireSlice: retirementSlice,
  carModalSlice: carModalSlice,
  houseSlice:houseSlice,
  auth: authSlice
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

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

// Need this in order to use useDipatch and useSelctor
export const Dispatch = useDispatch.withTypes<AppDispatch>()
export const UseSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;

// export const Dispatch: () => typeof store.dispatch = useDispatch;
// export const UseSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;


//listenerMiddleware.startListening({ actionCreator: todoAdded, effect })
// listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
// predicate: (_action, currentState, prevState) => {
//   return currentState.auth.user !== prevState.auth.user
// },
// effect: async (_action, listenerApi) => {
//   console.log("I want to clear all the goals on local storag")
// }
// })


 listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
 type:'logIn/fulfilled',
 effect: async (_action, listenerApi) => {
   console.log("I want to clear all the goals on local storag")
listenerApi.dispatch(setPrac())
 }
 })




