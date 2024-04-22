import { Loan } from "loanjs";

export interface HouseLoanObj {
  rate: number;
  time: number;
  downPayment: number;
  price: number;
  propertyTax: number;
  insurance: number;
  mortgageInsurance: number;
}

export interface ExtraNumberYears {
  numberOfYears: number;
  numberOfYearsNoRounding: number;
}

export interface HouseMonthlyPayment {
  monthlyPayment: number;
  totalWithInterest: number;
  extraMonthlyPayment: number;
  interestSum: number;
  totalAmountPaid: number;
  mortgageInsurance: number;
  insurance: number;
  propertyTax: number;
  totalTaxes: number;
  totalAmountPaidWithInterestAndTaxes: number;
}


export function getMonthlyPaymentForHouse(obj: HouseLoanObj, extraPayment: number, isNotGreaterThan20: boolean) {
  if (obj.downPayment > obj.price) return;

  const loanAmount = obj.price - obj.downPayment;
  const housePrice = obj.price;
  const rate = obj.rate / 100;
  const discountedRate = rate / 12;
  // take the number (30) and multiply it by 12 to get the total amount of payment periods
  const time = obj.time * 12;

  // Taxes
  const formatPropertyTax = obj.propertyTax / 100;
  const propertyTax = (formatPropertyTax * housePrice) / 12;

  const formatMortgageInsurance = obj.mortgageInsurance / 100;
  const mortgageInsurance = (formatMortgageInsurance * housePrice) / 12;

  const insurance = obj.insurance;

  // if down payment is not greater than 20 ... add mortgage insurance ... else add property tax and insurance
  const totalTaxes = isNotGreaterThan20 ? propertyTax + mortgageInsurance + insurance : propertyTax + insurance;


  // No tax calculation here
  const leftTop = loanAmount * discountedRate;
  const rightTop = Math.pow(1 + discountedRate, time);
  const top = leftTop * rightTop;

  const bottom = Math.pow(1 + discountedRate, time) - 1;

  const monthlyP = top / bottom;
  const totalPriceWithInterest = monthlyP * time;
  const interestAmount = totalPriceWithInterest - loanAmount;

  // Monthly Payment with taxes
  const monthlyPTax = monthlyP + totalTaxes
  const totalPriceWithInterestAndTaxes = monthlyPTax * time

  return {
    
      monthlyPayment:monthlyP,
      totalWithInterest:  totalPriceWithInterest,
      extraMonthlyPayment:monthlyP + extraPayment, 
      interestSum: interestAmount,
      // Total amount payed totalPriceWithInterest + down payment
      totalAmountPaid: totalPriceWithInterest + obj.downPayment,

      // Taxes
      mortgageInsurance: isNotGreaterThan20 ? mortgageInsurance : 0,
      insurance,
      propertyTax,
      totalTaxes,
      totalAmountPaidWithInterestAndTaxes: totalPriceWithInterestAndTaxes,
      
  };
}

export function loanAmmortizationForHouse(obj: HouseLoanObj, isNotGreaterThan20: boolean) {
  if (obj.downPayment > obj.price) return;

  let loanAmount = obj.price - obj.downPayment;

  const time = obj.time * 12;

  const loan = new Loan(
    loanAmount, // amount
    time, // installments number
    obj.rate, // interest rate
    "annuity" // loanType: 'annuity' | 'annuityDue' | 'diminishing' | GetNextInstalmentPartFunction
  );
  const monthlyPayment = getMonthlyPaymentForHouse(obj, 0, isNotGreaterThan20)?.monthlyPayment
  const rate = obj.rate / 100;
  const res = [];

  if (!monthlyPayment) return;

  for (let i = 0; i <= time; i++) {
    if (i >= 1) {
      let loanAmountTimesRate = (loanAmount * rate) / 12;
      let moneyTowardsPrincipal = monthlyPayment - loanAmountTimesRate;
      loanAmount = loanAmount - moneyTowardsPrincipal;

      res.push({
        time: i,
        price: loanAmount >= 0 ? (loanAmount.toString().includes("e") ? 0 : loanAmount) : 0,
      });
    }
  }

  //return loan
  //* Im going to return the loanjs and my own for loop ... just to make sure I get the same values ... making sure my numbers are accurate
  return {
    thirdPartyLoan: loan,
    myLoan: res,
  };
}

// Extra Payment Functions
// This function will return the number of months it will require to pay off loan with extra payments
export function solveForNumberOfMonthsForHouse(obj: HouseLoanObj, extraPayment: number, isNotGreaterThan20: boolean ) {
  if (obj.downPayment > obj.price) return;

  const loanAmount = obj.price - obj.downPayment;
  const monthlyPayment = getMonthlyPaymentForHouse(obj, extraPayment, isNotGreaterThan20)?.extraMonthlyPayment;

  if (!monthlyPayment) return;

  const rate = obj.rate / 100;
  const discountedRate = rate / 12;

  // Top of the fraction
  const monthlyPDividedByDiscountedRate = monthlyPayment / discountedRate;
  const topBottom = monthlyPDividedByDiscountedRate - loanAmount;

  const topTop = monthlyPDividedByDiscountedRate / topBottom;
  const topLog = Math.log(topTop);

  // Bottom of the fraction
  const bottom = 1 + discountedRate;
  const bottomLog = Math.log(bottom);

  const numberOfMonths = Number((topLog / bottomLog).toFixed(0));
  //console.log(numberOfMonths)
  return {
    numberOfYears: numberOfMonths / 12,
    numberOfYearsNoRounding: Number((topLog / bottomLog).toFixed(4)) / 12,
  };
}

export function loanAmmortizationWithExtraPaymentForHouse(obj: HouseLoanObj, extraPayment: number, isNotGreaterThan20: boolean ) {
  if (obj.downPayment > obj.price) return;

  let loanAmount = obj.price - obj.downPayment;
  const rate = obj.rate / 100;
  const monthlyPayment = getMonthlyPaymentForHouse(obj, extraPayment,isNotGreaterThan20)?.extraMonthlyPayment;
  const numberOfYears = solveForNumberOfMonthsForHouse(obj, extraPayment,isNotGreaterThan20)?.numberOfYears;
  const res = [];

  if (!monthlyPayment || !numberOfYears) return;

  // Need to turn number of years into months
  const time = numberOfYears * 12

  for (let i = 0; i <= time; i++) {
    if (i >= 1) {
      let loanAmountTimesRate = (loanAmount * rate) / 12;
      let moneyTowardsPrincipal = monthlyPayment - loanAmountTimesRate;
      loanAmount = loanAmount - moneyTowardsPrincipal;
      res.push({
        time: i,
        price: loanAmount >= 0 ? (loanAmount.toString().includes("e") ? 0 : loanAmount) : 0,
      });
    }
  }
  //console.log(monthlyPayment);
  //console.log(res);
  return res;
}
