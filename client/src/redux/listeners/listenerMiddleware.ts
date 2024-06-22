import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../store";
import { isTokenExpired } from "../utils/isTokenExpired";
import { setLogout, setResestCheckEmailAndResetPasswordToken, setResetPasswordToken } from "../features/authSlice";
import { setSelectedGoal } from "../features/applicationSlice";
import { RetirementGoals, setRetireGoals } from "../features/modalSlices/retirementSlice";
import { HouseObjWithFormattedData, setHouseGoals } from "../features/modalSlices/houseSlice";
import { CarObjWithFormattedData, setCarGoals } from "../features/modalSlices/carModalSlice";
import { createRetireGoal, deleteRetireGoal, updateRetireGoal, updateRetireTableName } from "../asyncActions/retireActions";
import {
  createHouseGoal,
  updateHouseGoal,
  updateHouseGoalImg,
  updateHouseGoalOppCost,
  deleteHouseGoal,
  updateHouseGoalAddress,
  hideAndShowHouseInputs,
  hideAndShowHouseOppCostInputs,
} from "../asyncActions/houseActions";
import { getAllGoals } from "../features/tablesSlice";
import { createCarGoal, deleteCarGoal, hideAndShowCarInputs, updateCarGoal, updateCarGoalImg, updateCarName } from "../asyncActions/carActions";

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
    const token = currentState.auth.user?.token;

    if (!token) return false;

    return isTokenExpired(token);
  },
  effect: async (_action, listenerApi) => {
    const stateToken = listenerApi.getState().auth.user?.token;

    if (stateToken) {
      listenerApi.dispatch(setLogout());
    }
  },
});

// When user logins in clear all local storage data
listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  type: "logIn/fulfilled",
  effect: async (_action, listenerApi) => {
    listenerApi.dispatch(setSelectedGoal(null));
    listenerApi.dispatch(setRetireGoals());
    listenerApi.dispatch(setHouseGoals());
    listenerApi.dispatch(setCarGoals());
  },
});

// When user signis in clear all local storage data
listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  type: "signUp/fulfilled",
  effect: async (_action, listenerApi) => {
    listenerApi.dispatch(setSelectedGoal(null));
    listenerApi.dispatch(setRetireGoals());
    listenerApi.dispatch(setHouseGoals());
    listenerApi.dispatch(setCarGoals());
  },
});

// When user creates new a goal or updates I want to refetch data
listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  matcher: isAnyOf(
    createRetireGoal.fulfilled,
    deleteRetireGoal.fulfilled,
    updateRetireGoal.fulfilled,
    updateRetireTableName.fulfilled,
    createHouseGoal.fulfilled,
    updateHouseGoal.fulfilled,
    deleteHouseGoal.fulfilled,
    updateHouseGoalOppCost.fulfilled,
    updateHouseGoalImg.fulfilled,
    updateHouseGoalAddress.fulfilled,
    hideAndShowHouseInputs.fulfilled,
    hideAndShowHouseOppCostInputs.fulfilled,
    createCarGoal.fulfilled,
    updateCarGoal.fulfilled,
    updateCarName.fulfilled,
    deleteCarGoal.fulfilled,
    updateCarGoalImg.fulfilled,
    hideAndShowCarInputs.fulfilled
  ),
  effect: async (_action, listenerApi) => {
    listenerApi.dispatch(getAllGoals({ limit: 10, page: 1 }));
  },
});

// When I logout set selected goal to null
listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  type: "auth/setLogout",
  effect: async (_action, listenerApi) => {
    listenerApi.dispatch(setSelectedGoal(null));
  },
});

// After successfully creating a goal ... I want set that as the selected goal ... only will call when we call an action dealing with a logged in user

// When a retirement goal is created ... set that as the selected goal
listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  type: "createRetireGoal/fulfilled",
  effect: (action: any, listenerApi) => {
    const backendData: RetirementGoals = action.payload;
    if (!backendData) return;
    const {
      type,
      retireAge,
      lifeExpectancy,
      currentAge,
      budget,
      preRate,
      postRate,
      inflation,
      monthlyContribution,
      savings,
      title,
      showInputs,
      id,
      creator,
      date,
    } = backendData;

    const retireGoal: RetirementGoals = {
      id,
      title,
      type,
      currentAge,
      retireAge,
      lifeExpectancy,
      budget,
      preRate,
      postRate,
      inflation,
      monthlyContribution,
      savings,
      showInputs,
      creator,
      date,
    };

    listenerApi.dispatch(setSelectedGoal(retireGoal));
  },
});

// When a house goal is created ... set that as the selected goal
listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  type: "createHouseGoal/fulfilled",
  effect: (action: any, listenerApi) => {
    const backendData: HouseObjWithFormattedData = action.payload;
    if (!backendData) return;
    const {
      id,
      streetAddress,
      date,
      price,
      downPayment,
      interest,
      term,
      extraPayment,
      img,
      propertyTax,
      insurance,
      mortgageInsurance,
      appreciation,
      opportunityCostRate,
      maintenance,
      rent,
      showInputs,
      showOppCostInputs,
      showTax,
      type,
      creator,
    } = backendData;

    const houseGoal: HouseObjWithFormattedData = {
      id,
      streetAddress,
      price,
      downPayment,
      interest,
      term,
      extraPayment,
      img: img ? img : "",
      propertyTax,
      insurance,
      mortgageInsurance,
      appreciation,
      opportunityCostRate,
      maintenance,
      rent,
      type,
      showTax,
      showInputs,
      showOppCostInputs,
      creator,
      date,
    };

    listenerApi.dispatch(setSelectedGoal(houseGoal));
  },
});

// When a car goal is created ... set that as the selected goal
listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  type: "createCarGoal/fulfilled",
  effect: (action: any, listenerApi) => {
    const backendData: CarObjWithFormattedData = action.payload;
    if (!backendData) return;
    const { id, price, downPayment, interest, term, mileage, extraPayment, date, name, img, showInputs, modal, type, creator } = backendData;

    const carGoal: CarObjWithFormattedData = {
      id,
      name,
      type,
      price,
      downPayment,
      interest,
      mileage,
      modal,
      term,
      img: img ? img : "",
      extraPayment,
      showInputs,
      date,
      creator,
    };

    listenerApi.dispatch(setSelectedGoal(carGoal));
  },
});
