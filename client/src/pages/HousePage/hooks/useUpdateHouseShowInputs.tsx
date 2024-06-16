import { Dispatch, UseSelector } from "../../../redux/store";
import { HouseObjWithFormattedData, houseShowInput, houseShowOppCostInput } from "../../../redux/features/modalSlices/houseSlice";
import { selectedShowInput, selectedShowOppCostInput } from "../../../redux/features/applicationSlice";
import { hideAndShowHouseInputs, hideAndShowHouseOppCostInputs } from "../../../redux/asyncActions/houseActions";

export interface IuseUpdateHouseShowInputsProps {
  selectedGoal: HouseObjWithFormattedData;
}

export default function useUpdateHouseShowInputs({ selectedGoal }: IuseUpdateHouseShowInputsProps) {
  // Redux States
  const dispatch = Dispatch();
  const { user } = UseSelector((state) => state.auth);

  const userId = user?.userObj.id;

  // Toggle House Inputs === TRUE
  function handleShowHouseInputs() {
    if (userId) {
      dispatch(selectedShowInput({ goal: selectedGoal, value: true }));
      dispatch(hideAndShowHouseInputs({ id: selectedGoal.id, inputs: true }));
    } else {
      dispatch(selectedShowInput({ goal: selectedGoal, value: true }));
      dispatch(houseShowInput({ id: selectedGoal.id, value: true }));
    }
  }

  // Toggle House Inputs === FALSE
  function handleHideHouseInputs() {
    if (userId) {
      dispatch(selectedShowInput({ goal: selectedGoal, value: false }));
      dispatch(hideAndShowHouseInputs({ id: selectedGoal.id, inputs: false }));
    } else {
      dispatch(selectedShowInput({ goal: selectedGoal, value: false }));
      dispatch(houseShowInput({ id: selectedGoal.id, value: false }));
    }
  }

  // --------------------------------------------- House Opp Cost Inputs Functions --------------------------------------------

  // Toggle Opp Cost Inputs === TRUE
  function handleShowOppCostInputs() {
    if (userId) {
      dispatch(selectedShowOppCostInput({ goal: selectedGoal, value: true }));
      dispatch(hideAndShowHouseOppCostInputs({ id: selectedGoal.id, oppCostInputs: true }));
    } else {
      dispatch(selectedShowOppCostInput({ goal: selectedGoal, value: true }));
      dispatch(houseShowOppCostInput({ id: selectedGoal.id, value: true }));
    }
  }

  function handleHideShowOppCostInputs(){
    if (userId) {
        dispatch(selectedShowOppCostInput({ goal: selectedGoal, value: false }));
        dispatch(hideAndShowHouseOppCostInputs({ id: selectedGoal.id, oppCostInputs: false }));
      } else {
        dispatch(selectedShowOppCostInput({ goal: selectedGoal, value: false }));
        dispatch(houseShowOppCostInput({ id: selectedGoal.id, value: false }));
      }
  }

  return {
    handleHideHouseInputs,
    handleShowHouseInputs,
    handleShowOppCostInputs,
    handleHideShowOppCostInputs
  };
}
