import * as React from "react";
import { futureValueOfOppCost } from "../../../components/helperFunctions/oppCostFunctions/oppCostFunction";
import { getBreakEvenNumber } from "../components/utils/getBreakEvenNumber";
import { HouseObjWithFormattedData } from "../../../redux/features/modalSlices/houseSlice";

export interface IuseHouseOppCostFVFunctionProps {
  selectedGoal: HouseObjWithFormattedData;
  diffCost: number;
}

export default function useHouseOppCostFVFunction({ selectedGoal, diffCost }: IuseHouseOppCostFVFunctionProps) {
  const breakEvenOppCost = React.useMemo(() => {
    return futureValueOfOppCost(selectedGoal, "breakEven", getBreakEvenNumber(selectedGoal).resultNoFormat);
  }, [selectedGoal]);

  const rentOppCost = React.useMemo(() => {
    return futureValueOfOppCost(selectedGoal, "rent", selectedGoal.rent);
  }, [selectedGoal]);

  const diffOppCost = React.useMemo(() => {
    return futureValueOfOppCost(selectedGoal, "breakEven", diffCost);
  }, [selectedGoal, diffCost]);

  return {
    breakEvenOppCost,
    rentOppCost,
    diffOppCost,
  };
}
