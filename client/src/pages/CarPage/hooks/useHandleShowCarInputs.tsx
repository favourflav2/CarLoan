
import { Dispatch, UseSelector } from "../../../redux/store";
import { selectedShowInput} from "../../../redux/features/applicationSlice";
import { CarObjWithFormattedData, carShowInput } from "../../../redux/features/modalSlices/carModalSlice";
import { hideAndShowCarInputs } from "../../../redux/asyncActions/carActions";

export interface IuseHandleShowCarInputsProps {
    selectedGoal: CarObjWithFormattedData
}

export default function useHandleShowCarInputs ({selectedGoal}: IuseHandleShowCarInputsProps) {

     // Redux States
  const { user } = UseSelector((state) => state.auth);
  const dispatch = Dispatch();

  const userId = user?.userObj.id;

  // Toggle House Inputs === TRUE
  function handleShowHouseInputs() {
    if (userId) {
      dispatch(selectedShowInput({ goal: selectedGoal, value: true }));
      dispatch(hideAndShowCarInputs({ id: selectedGoal.id, inputs: true }));
    } else {
      dispatch(selectedShowInput({ goal: selectedGoal, value: true }));
      dispatch(carShowInput({ id: selectedGoal.id, value: true }));
    }
  }

  // Toggle House Inputs === FALSE
  function handleHideHouseInputs() {
    if (userId) {
      dispatch(selectedShowInput({ goal: selectedGoal, value: false }));
      dispatch(hideAndShowCarInputs({ id: selectedGoal.id, inputs: false }));
    } else {
      dispatch(selectedShowInput({ goal: selectedGoal, value: false }));
      dispatch(carShowInput({ id: selectedGoal.id, value: false }));
    }
  }
  
  return {
    handleHideHouseInputs,
    handleShowHouseInputs
  }
}
