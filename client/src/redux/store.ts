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
import authSlice, { setResestCheckEmailAndResetPasswordToken, setResetPasswordToken } from "./features/authSlice";
import { isTokenExpired } from "./utils/isTokenExpired";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["car"],
  //whitelist: ["page", "app", "retireSlice", "carModalSlice"],
};

const listenerMiddleware = createListenerMiddleware();

const reducer = combineReducers({
  car: carSlice,
  page: carStateSlice,
  app: applicationSlice,
  retireSlice: retirementSlice,
  carModalSlice: carModalSlice,
  houseSlice: houseSlice,
  auth: authSlice,
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

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

// Need this in order to use useDipatch and useSelctor
export const Dispatch = useDispatch.withTypes<AppDispatch>();
export const UseSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;

// export const Dispatch: () => typeof store.dispatch = useDispatch;
// export const UseSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;

// This is my session creator ... this will help me privatize my reset password pages
//* Once the token we get from the backend expires my listen middleware will set the token state back the null and a user wont be able to go back to reset pages
listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  predicate: (_action, currentState, prevState) => {
    const token = currentState.auth.resetPasswordToken;

    if (!token) return false;

    return isTokenExpired(token);
  },
  effect: async (_action, listenerApi) => {
    const stateToken = listenerApi.getState().auth.resetPasswordToken;

    if (stateToken) {
      listenerApi.dispatch(setResetPasswordToken());
    }
  },
});

listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  predicate: (_action, currentState, prevState) => {
    const token = currentState.auth.checkEmailAndResetPasswordToken;

    if (!token) return false;

    return isTokenExpired(token);
  },
  effect: async (_action, listenerApi) => {
    const stateToken = listenerApi.getState().auth.checkEmailAndResetPasswordToken;

    if (stateToken) {
      listenerApi.dispatch(setResestCheckEmailAndResetPasswordToken());
    }
  },
});
