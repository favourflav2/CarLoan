import * as React from "react";
import { UseSelector } from "../../../redux/store";
import {
  getMonthlyPayment,
  loanAmmortization,
  loanAmmortizationWithExtraPayment,
  solveForNumberOfMonths,
} from "../../../components/helperFunctions/loanfunctions/LoanFunction";


export default function useCarFVFunction() {
  const { selectedGoal } = UseSelector((state) => state.app);

  const monthlyPayment = React.useMemo(() => {
    if (!selectedGoal || selectedGoal.type !== "Car") return;
    return getMonthlyPayment(
      { rate: selectedGoal.interest, time: selectedGoal.term, downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price },
      selectedGoal.extraPayment
    );
  }, [selectedGoal]);

  const regualrLoanAmmortization = React.useMemo(() => {
    if (!selectedGoal || selectedGoal.type !== "Car") return;
    return loanAmmortization({
      rate: selectedGoal.interest,
      time: selectedGoal.term,
      downPayment: selectedGoal.downPayment,
      carPrice: selectedGoal.price,
    });
  }, [selectedGoal]);

  const extraNumberOfMonths = React.useMemo(() => {
    if (!selectedGoal || selectedGoal.type !== "Car") return;
    return solveForNumberOfMonths(
      { rate: selectedGoal.interest, time: selectedGoal.term, downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price },
      selectedGoal.extraPayment
    );
  }, [selectedGoal]);

  const extraLoanAmmortization = React.useMemo(() => {
    if (!selectedGoal || selectedGoal.type !== "Car") return;
    return loanAmmortizationWithExtraPayment(
      { rate: selectedGoal.interest, time: selectedGoal.term, downPayment: selectedGoal.downPayment, carPrice: selectedGoal.price },
      selectedGoal.extraPayment
    );
  }, [selectedGoal]);

  return {
    monthlyPayment,
    regualrLoanAmmortization,
    extraNumberOfMonths,
    extraLoanAmmortization
  };
}
