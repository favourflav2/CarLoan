import * as React from "react";
import { Dispatch, UseSelector } from "../../../redux/store";
import { HouseObjWithFormattedData, houseShowInput, houseShowOppCostInput } from "../../../redux/features/modalSlices/houseSlice";
import { selectedShowInput, selectedShowOppCostInput } from "../../../redux/features/applicationSlice";
import { hideAndShowHouseInputs, hideAndShowHouseOppCostInputs } from "../../../redux/asyncActions/houseActions";

export interface IuseShowInputsMobileProps {
  selectedGoal: HouseObjWithFormattedData;
  matches: boolean;
}

export default function useShowInputsMobile({ selectedGoal, matches }: IuseShowInputsMobileProps) {
  // Redux States
  const { user } = UseSelector((state) => state.auth);
  const dispatch = Dispatch();

  const userId = user?.userObj.id;

  // Show Inputs from selected goal
  const { showInputs, showOppCostInputs } = selectedGoal;

  React.useEffect(() => {
    // This useEffect will only be ran when the showInputs is false ... mobile users will be able to hide and show the inputs ... but when the screen width gets bigger showInputs will be set to true
    if (showInputs === false) {
      // Matches min width is 1024 ... is screen width is 1024 or greater ... we will set showInputs to true
      if (matches) {
        // When theres a logged in user we need to send data to the server
        if (userId) {
          dispatch(selectedShowInput({ goal: selectedGoal, value: true }));
          dispatch(hideAndShowHouseInputs({ id: selectedGoal.id, inputs: true }));
        } else {
          // No logged in user ... we will use local storage
          dispatch(selectedShowInput({ goal: selectedGoal, value: true }));
          dispatch(houseShowInput({ id: selectedGoal.id, value: true }));
        }
      }
    }
  }, [selectedGoal, showInputs, matches, userId]); //eslint-disable-line

  React.useEffect(() => {
    if (showOppCostInputs === false) {
      if (matches) {
        if (userId) {
          // Logged in user .. we will send data to server
          dispatch(selectedShowOppCostInput({ goal: selectedGoal, value: true }));
          dispatch(hideAndShowHouseOppCostInputs({ id: selectedGoal.id, oppCostInputs: true }));
        } else {
          // No logged in user
          dispatch(selectedShowOppCostInput({ goal: selectedGoal, value: true }));
          dispatch(houseShowOppCostInput({ id: selectedGoal.id, value: true }));
        }
      }
    }
  }, [matches, showOppCostInputs, selectedGoal, userId]); //eslint-disable-line

  return {
    showInputs,
    showOppCostInputs
  };
}
