import { goal, setSelectedGoal } from "../../../redux/features/applicationSlice";
import { CarObjWithFormattedData } from "../../../redux/features/modalSlices/carModalSlice";
import { HouseObjWithFormattedData, removeHouseGoal } from "../../../redux/features/modalSlices/houseSlice";
import { RetirementGoals, removeRetireItem } from "../../../redux/features/modalSlices/retirementSlice";

import * as React from "react";
import { Dispatch, UseSelector } from "../../../redux/store";
import { deleteRetireGoal } from "../../../redux/asyncActions/retireActions";


export interface IDeleteSwitchCaseProps {
  item: RetirementGoals | CarObjWithFormattedData | HouseObjWithFormattedData;
}

export default function DeleteSwitchCase({ item }: IDeleteSwitchCaseProps) {
  const { selectedGoal } = UseSelector((state) => state.app);
  const { user } = UseSelector((state) => state.auth);
  const dispatch = Dispatch();

  // user Id
  const userId = user?.userObj.id;

  // Delete Retire Goal
  function deleteRetireFunction(item: RetirementGoals | CarObjWithFormattedData | HouseObjWithFormattedData) {
    if (!item) return;
    if (item.type !== "Retirement") return;

    if (userId) {
      // if userId we run this
      if (selectedGoal?.id === item.id) {
        dispatch(setSelectedGoal(null));
        dispatch(deleteRetireGoal({ type: item.type, id: item.id }));
      } else {
        dispatch(deleteRetireGoal({ type: item.type, id: item.id }));
      }
    } else {
      // if theres no user/userId we run this
      if (selectedGoal?.id === item.id) {
        dispatch(setSelectedGoal(null));
        dispatch(removeRetireItem(item));
      } else {
        dispatch(removeRetireItem(item));
      }
    }
  }

  // Delete House Goal
  function deleteHouseFunction(item: RetirementGoals | CarObjWithFormattedData | HouseObjWithFormattedData) {
    if (!item) return;
    if (item.type !== "House") return;

    if (userId) {
      // id we have a user/userId
      if (selectedGoal?.id === item.id) {
        dispatch(setSelectedGoal(null));
        //dispatch(deleteHouseGoal({ type: item.type, id: item.id }));
      } else {
        //dispatch(deleteHouseGoal({ type: item.type, id: item.id }));
      }
    } else {
      // if we dont have a user/userId
      if (selectedGoal?.id === item.id) {
        dispatch(setSelectedGoal(null));
        dispatch(removeHouseGoal(item));
      } else {
        dispatch(removeHouseGoal(item));
      }
    }

    console.log("favour")
  }
  return {
    deleteRetireFunction,
    deleteHouseFunction
  };
}
