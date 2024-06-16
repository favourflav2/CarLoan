
import { Dispatch, UseSelector } from "../../../redux/store";
import { HouseObjWithFormattedData, houseShowInput } from "../../../redux/features/modalSlices/houseSlice";
import { selectedShowInput } from "../../../redux/features/applicationSlice";
import { hideAndShowHouseInputs } from "../../../redux/asyncActions/houseActions";

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
  
  return {
    handleHideHouseInputs,
    handleShowHouseInputs
  }
}
