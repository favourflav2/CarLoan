import { createListenerMiddleware, isAnyOf} from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../store";
import { isTokenExpired } from "../utils/isTokenExpired";
import { setLogout, setResestCheckEmailAndResetPasswordToken, setResetPasswordToken } from "../features/authSlice";
import { setSelectedGoal } from "../features/applicationSlice";
import { setRetireGoals } from "../features/modalSlices/retirementSlice";
import { setHouseGoals } from "../features/modalSlices/houseSlice";
import { setCarGoals } from "../features/modalSlices/carModalSlice";
import { createHouseGoal, createRetireGoal, deleteRetireGoal, getAllGoals, updateRetireGoal, updateRetireTableName } from "../features/tablesSlice";


 export const listenerMiddleware = createListenerMiddleware();

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

  // I have a useEffect in my navbar that is responseable for logging out a user when a token is expired
  //* However, it needs an action to do it and recently it didnt call right away 
  // So im also going to create a listener 
  listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
    predicate: (_action, currentState, prevState) => {
      const token = currentState.auth.user?.token
     
  
      if (!token) return false;
  
      return isTokenExpired(token);
    },
    effect: async (_action, listenerApi) => {
      const stateToken = listenerApi.getState().auth.user?.token
     
      if (stateToken) {
        listenerApi.dispatch(setLogout());
      }
    },
  });


  
  // When user logins in clear all local storage data
  listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
    type:"logIn/fulfilled",
    effect: async (_action, listenerApi) => {
      listenerApi.dispatch(setSelectedGoal(null))
      listenerApi.dispatch(setRetireGoals())
      listenerApi.dispatch(setHouseGoals())
      listenerApi.dispatch(setCarGoals())
    },
  })

   // When user signis in clear all local storage data
  listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
    type:"signUp/fulfilled",
    effect: async (_action, listenerApi) => {
      listenerApi.dispatch(setSelectedGoal(null))
      listenerApi.dispatch(setRetireGoals())
      listenerApi.dispatch(setHouseGoals())
      listenerApi.dispatch(setCarGoals())
    },
  })

  // When user creates new a goal or updates I want to refetch data
  listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
    matcher: isAnyOf(createRetireGoal.fulfilled,deleteRetireGoal.fulfilled, updateRetireGoal.fulfilled, updateRetireTableName.fulfilled, createHouseGoal.fulfilled),
    effect: async (_action, listenerApi) => {
      listenerApi.dispatch(getAllGoals({ limit: 10, page: 1 }))
    },
  })

  // When I logout set selected goal to null
  listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
    type:"auth/setLogout",
    effect: async (_action, listenerApi) => {
      listenerApi.dispatch(setSelectedGoal(null))
    },
  })


