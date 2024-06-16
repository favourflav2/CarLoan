//import * as React from "react";
import { Dispatch, UseSelector } from "../../../redux/store";
import { RetirementGoals, editRetireGoal } from "../../../redux/features/modalSlices/retirementSlice";
import { editSelectedGoal } from "../../../redux/features/applicationSlice";
import { updateRetireGoal } from "../../../redux/asyncActions/retireActions";

export interface IuseHandleUpdateProps {
  inputs: {
    age: {
      currentAge: number;
      retireAge: number;
      lifeExpectancy: number;
    };
    savings: string;
    monthlyContribution: string;
    budget: string;
    preRate: string;
    postRate: string;
    inflation: string;
    id?: string | undefined;
  };
  errorsArray: string[];
}

export default function useHandleUpdate({ errorsArray, inputs }: IuseHandleUpdateProps) {
  // Redux states
  const dispatch = Dispatch();
  const { selectedGoal } = UseSelector((state) => state.app);
  const { user } = UseSelector((state) => state.auth);

  // UserId
  const userId = user?.userObj.id;

  function handleUpdate() {
    if (!selectedGoal?.id || selectedGoal?.type !== "Retirement") return;

    if (errorsArray.length) return;

    const {
        age: { currentAge, lifeExpectancy, retireAge },
        monthlyContribution,
        preRate,
        postRate,
        inflation,
        budget,
        savings,
      } = inputs;


      const { title, id, type, showInputs, creator, date } = selectedGoal;


      const newObj: RetirementGoals = {
        id,
        title,
        type,
        currentAge,
        retireAge,
        lifeExpectancy,
        budget: parseFloat(budget.replace(/[,%$]/gm, "")),
        preRate: parseFloat(preRate.replace(/[,%$]/gm, "")),
        postRate: parseFloat(postRate.replace(/[,%$]/gm, "")),
        inflation: parseFloat(inflation.replace(/[,%$]/gm, "")),
        monthlyContribution: parseFloat(monthlyContribution.replace(/[,%$]/gm, "")),
        savings: parseFloat(savings.replace(/[,%$]/gm, "")),
        showInputs,
        creator,
        date
      };

      

    // Checking for a user
    if (userId) {
        dispatch(editSelectedGoal({ goal: newObj }));
        dispatch(updateRetireGoal({type:"Retirement", id, inputData:newObj}))
    } else {
      dispatch(editSelectedGoal({ goal: newObj }));
      dispatch(editRetireGoal({ id, title, goal: newObj }));
    }
  }
  
  return {
    handleUpdate
  }
}
