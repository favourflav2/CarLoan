import * as React from "react";
import { UseSelector } from "../../../redux/store";
import { getMonthlyPaymentForHouse, loanAmmortizationForHouse, loanAmmortizationWithExtraPaymentForHouse, solveForNumberOfMonthsForHouse } from "../../../components/helperFunctions/loanfunctions/HouseLoanFuntion";


export default function useHouseFVFunctions() {
  const { selectedGoal } = UseSelector((state) => state.app);

  const monthlyPayment = React.useMemo(() => {
    if (!selectedGoal || selectedGoal.type !== "House") return;
    const { interest, downPayment, insurance, mortgageInsurance, propertyTax, price, term } = selectedGoal;
    const twentyPercentValue = price * 0.2;
    const isNotGreaterThan20 = downPayment < twentyPercentValue ? true : false;

    return getMonthlyPaymentForHouse(
      { rate: interest, time: term, downPayment, price, propertyTax, insurance, mortgageInsurance },
      selectedGoal.extraPayment,
      isNotGreaterThan20
    );
  }, [selectedGoal]);

  const regualrLoanAmmortization = React.useMemo(() => {
    if (!selectedGoal || selectedGoal.type !== "House") return;
    const { interest, downPayment, insurance, mortgageInsurance, propertyTax, price, term } = selectedGoal;
    const twentyPercentValue = price * 0.2;
    const isNotGreaterThan20 = downPayment < twentyPercentValue ? true : false;

    return loanAmmortizationForHouse(
      { rate: interest, time: term, downPayment, price, propertyTax, insurance, mortgageInsurance },
      isNotGreaterThan20
    );
  }, [selectedGoal]);

  const extraNumberOfYears = React.useMemo(() => {
    if (!selectedGoal || selectedGoal.type !== "House") return;
    const { interest, downPayment, insurance, mortgageInsurance, propertyTax, price, term } = selectedGoal;
    const twentyPercentValue = price * 0.2;
    const isNotGreaterThan20 = downPayment < twentyPercentValue ? true : false;

    return solveForNumberOfMonthsForHouse({ rate: interest, time: term, downPayment, price, propertyTax, insurance, mortgageInsurance }, selectedGoal.extraPayment, isNotGreaterThan20)
  }, [selectedGoal]);

  const extraLoanAmmortization = React.useMemo(()=>{
    if (!selectedGoal || selectedGoal.type !== "House") return;
    const { interest, downPayment, insurance, mortgageInsurance, propertyTax, price, term } = selectedGoal;
    const twentyPercentValue = price * 0.2;
    const isNotGreaterThan20 = downPayment < twentyPercentValue ? true : false;

    return loanAmmortizationWithExtraPaymentForHouse({ rate: interest, time: term, downPayment, price, propertyTax, insurance, mortgageInsurance }, selectedGoal.extraPayment, isNotGreaterThan20)
  },[selectedGoal])
  return {
    monthlyPayment,
    regualrLoanAmmortization,
    extraNumberOfYears,
    extraLoanAmmortization
  };
}
