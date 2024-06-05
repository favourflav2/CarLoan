import { createListenerMiddleware, isAnyOf} from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../store";
import { isTokenExpired } from "../utils/isTokenExpired";
import { setResestCheckEmailAndResetPasswordToken, setResetPasswordToken } from "../features/authSlice";
import { setSelectedGoal } from "../features/applicationSlice";
import { setRetireGoals } from "../features/modalSlices/retirementSlice";
import { setHouseGoals } from "../features/modalSlices/houseSlice";
import { setCarGoals } from "../features/modalSlices/carModalSlice";
import { createRetireGoal, deleteRetireGoal, getAllGoals } from "../features/tablesSlice";


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

  // When user creates new retire goal I want to refetch data
  listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
    matcher: isAnyOf(createRetireGoal.fulfilled,deleteRetireGoal.fulfilled),
    effect: async (_action, listenerApi) => {
      listenerApi.dispatch(getAllGoals({ limit: 10, page: 1 }))
    },
  })

  // type(pin):"auth/setLogout"
  listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
    type:"auth/setLogout",
    effect: async (_action, listenerApi) => {
      listenerApi.dispatch(setSelectedGoal(null))
    },
  })


