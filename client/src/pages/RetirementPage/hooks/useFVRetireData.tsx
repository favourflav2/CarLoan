import * as React from "react";
import { UseSelector } from "../../../redux/store";
import futureValueWhatYouHave from "../../../components/helperFunctions/retirementFunctions/futureValueWhatYouHave";
import getWhatYouNeedFinalPrice from "../../../components/helperFunctions/retirementFunctions/getWhatYouNeedFinalPrice";
import futureValueWhatYouWillNeed from "../../../components/helperFunctions/retirementFunctions/futureValueWhatYouWillNeed";
import { getMonthlyPaymentForHave, getMonthlyPaymentForNeed } from "../../../components/helperFunctions/retirementFunctions/getMonthlyPaymentForHave";

export default function useFVRetireData() {
  const { selectedGoal } = UseSelector((state) => state.app);

  const have = React.useMemo(() => {
    if (selectedGoal && selectedGoal.type === "Retirement") {
      return futureValueWhatYouHave(selectedGoal);
    }
  }, [selectedGoal]);

  const needFinalPrice = React.useMemo(() => {
    if (selectedGoal && selectedGoal.type === "Retirement") {
      return getWhatYouNeedFinalPrice(selectedGoal);
    }
  }, [selectedGoal]);

  const need = React.useMemo(() => {
    if (selectedGoal && selectedGoal.type === "Retirement") {
      return futureValueWhatYouWillNeed(selectedGoal);
    }
  }, [selectedGoal]);

  const haveRetireBudget = React.useMemo(() => {
    if (selectedGoal && selectedGoal.type === "Retirement") {
      return getMonthlyPaymentForHave(selectedGoal, futureValueWhatYouHave(selectedGoal).highestNumNoFormat);
    }
  }, [selectedGoal]);

  const needMonthlyContribution = React.useMemo(() => {
    if (selectedGoal && selectedGoal.type === "Retirement") {
      return getMonthlyPaymentForNeed(selectedGoal);
    }
  }, [selectedGoal]);

  return {
    have,
    needFinalPrice,
    need,
    haveRetireBudget,
    needMonthlyContribution,
  };
}
