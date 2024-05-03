import { HouseObjWithFormattedData } from "../../../../redux/features/modalSlices/houseSlice";
import { USDollar } from "../../../CarPage/CarPage";


export function getBreakEvenNumber(select: HouseObjWithFormattedData) {
    const { interest, maintenance, propertyTax, opportunityCostRate, appreciation, price, downPayment } = select;

    // Decimals
    const maintenanceRateDecimal = maintenance / 100;
    const propertyTaxRateDecimal = propertyTax / 100;
    const interestRateDecimal = interest / 100;

    // Loan Amount
    const loanAmount = price - downPayment;

    // Difference in appreciation vs s&p 500/ or any other rate
    const diff = (opportunityCostRate - appreciation) / 100;

    const maintenanceValue = maintenanceRateDecimal * price;
    const propertyTaxValue = propertyTaxRateDecimal * price;

    // if down payment is greater than 0 ... then we need to calculate the opp cost of the down payment
    if (downPayment > 0) {
      const downPaymentOppCost = diff * downPayment;
      const loanAmountCostOfDebt = interestRateDecimal * loanAmount;

      const totalNonRecoverableCostNoFormat = (maintenanceValue + propertyTaxValue + downPaymentOppCost + loanAmountCostOfDebt) / price;
      const totalNonRecoverableCostFormatted = parseFloat((((maintenanceValue + propertyTaxValue + downPaymentOppCost + loanAmountCostOfDebt) / price) * 100).toFixed(2));

      const resultNoFormat = (price * totalNonRecoverableCostNoFormat) / 12;
      const resultFormatted = parseFloat(((price * totalNonRecoverableCostNoFormat) / 12).toFixed(2));

      return {
        rulePercent: totalNonRecoverableCostNoFormat,
        rulePercentFormatted: totalNonRecoverableCostFormatted,
        resultFormatted: USDollar.format(resultFormatted),
        resultNoFormat,
        noDownPayment: false,
      };
    } else {
      //* If theres no down payment we just add up all the percentages and find the value
      const totalNonRecoverableCostNoFormat = interestRateDecimal + maintenanceRateDecimal + propertyTaxRateDecimal;
      const totalNonRecoverableCostFormatted = parseFloat(((interestRateDecimal + maintenanceRateDecimal + propertyTaxRateDecimal) * 100).toFixed(2));

      const resultNoFormat = (price * totalNonRecoverableCostNoFormat) / 12;
      const resultFormatted = parseFloat(((price * totalNonRecoverableCostNoFormat) / 12).toFixed(2));

      return {
        rulePercent: totalNonRecoverableCostNoFormat,
        rulePercentFormatted: totalNonRecoverableCostFormatted,
        resultFormatted: USDollar.format(resultFormatted),
        resultNoFormat,
        noDownPayment: true,
      };
    }
  }