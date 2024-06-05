import * as React from "react";
import { RetirementGoals } from "../../../redux/features/modalSlices/retirementSlice";
import { UseFormWatch } from "react-hook-form";
import { CarObjWithFormattedData } from "../../../redux/features/modalSlices/carModalSlice";
import { HouseObjWithFormattedData } from "../../../redux/features/modalSlices/houseSlice";
import _ from "lodash";

export interface IuseCheckValidRetireProps {
  watch: UseFormWatch<{
    budget: string;
    preRate: string;
    postRate: string;
    inflation: string;
    monthlyContribution: string;
    savings: string;
    age: {
      currentAge: number;
      lifeExpectancy: number;
      retireAge: number;
    };
    id?: string | undefined;
  }>;
  selectedGoal: RetirementGoals | CarObjWithFormattedData | HouseObjWithFormattedData | null;
}

type OnlyInputs = Omit<RetirementGoals, "creator" | "date">;

export default function useCheckValidRetire({ selectedGoal, watch }: IuseCheckValidRetireProps) {
  const [showUpadateBtn, setShowUpdateBtn] = React.useState<boolean>(false);

  React.useEffect(() => {
    function checkValid(select: RetirementGoals, inputStates: any) {
      if (!select) return false;
      const { title, id, type, showInputs } = select;

      const {
        age: { lifeExpectancy, currentAge, retireAge },
        savings,
        budget,
        preRate,
        inflation,
        postRate,
        monthlyContribution,
      } = inputStates;

      const obj: OnlyInputs = {
        id,
        title,
        currentAge,
        lifeExpectancy,
        retireAge,
        type,
        budget: parseFloat(budget.replace(/[,%$]/gm, "")),
        preRate: parseFloat(preRate.replace(/[,%$]/gm, "")),
        postRate: parseFloat(postRate.replace(/[,%$]/gm, "")),
        inflation: parseFloat(inflation.replace(/[,%$]/gm, "")),
        monthlyContribution: parseFloat(monthlyContribution.replace(/[,%$]/gm, "")),
        savings: parseFloat(savings.replace(/[,%$]/gm, "")),
        showInputs,
      };

      const stateSelect: OnlyInputs = {
        title,
        id,
        type,
        showInputs,
        currentAge: select.currentAge,
        lifeExpectancy: select.lifeExpectancy,
        inflation: select.inflation,
        postRate: select.postRate,
        preRate: select.preRate,
        savings: select.savings,
        monthlyContribution: select.monthlyContribution,
        retireAge: select.retireAge,
        budget: select.budget
      };

      const isTheSame = _.isEqual(obj, stateSelect);
      if (isTheSame) {
        setShowUpdateBtn(false);
        return false;
      } else {
        setShowUpdateBtn(true);
        return true;
      }
    }
    const subscription = watch((data) => {
      if (!selectedGoal || selectedGoal?.type !== "Retirement") return;
      checkValid(selectedGoal, data);
    });
    return () => subscription.unsubscribe();
  }, [watch, selectedGoal]);

  return {showUpadateBtn};
}
