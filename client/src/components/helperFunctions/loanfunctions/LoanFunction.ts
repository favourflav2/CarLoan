import { Loan } from "loanjs";
import { USDollar } from "../../../pages/CarPage/CarPage";

export interface LoanObj {
  rate: number;
  time: number;
  downPayment: number;
  carPrice: number;
}

export interface MonthlyPayment {
  monthlyPayment: number;
  totalWithInterest: number;
  extraMonthlyPayment: number;
  interestSum:number;
  totalAmountPaid:number
}

export interface Installments {
  capital: number;
  interest: number; 
  installment: number; 
  remain: number; 
  interestSum: number;
}

export interface LoanJSType {
  amount:number;
  capitalSum:number;
  installments: Array<Installments>
  interestSum:number;
  sum:number
}

export interface MyLoanForLoop {
  time:number;
  price:number
}

export interface LoanAmmortizationType {
  myLoan: Array<MyLoanForLoop>;
  thirdPartyLoan:LoanJSType;
}

export interface ExtraNumberMonths {
  numberOfMonths: number;
  numberOfMonthsNoRounding: number;
}

//* To solve for extra payments all we do is add the extra payment amount to the original payment
// If pur monthly payment is 1000 and our extra payment is 500 ... all we do is add them together to get new monthly payment
//* 1500 ... then we just solve for how much time it will take

// this function grabs the monthly payment ... and adds the the extra payment to the monthlyPayment ... returns an object
export function getMonthlyPayment(obj: LoanObj, extraPayment: number) {
  if (obj.downPayment > obj.carPrice) return

  const loanAmount = obj.carPrice - obj.downPayment;
  const rate = obj.rate / 100;

  const discountedRate = rate / 12;
  const leftTop = loanAmount * discountedRate;
  const rightTop = Math.pow(1 + discountedRate, obj.time);
  const top = leftTop * rightTop;

  const bottom = Math.pow(1 + discountedRate, obj.time) - 1;

  const monthlyP = top / bottom;
  const totalPriceWithInterest = monthlyP * obj.time
  const interestAmount = totalPriceWithInterest - loanAmount

  //console.log({month:monthlyP,total:totalPriceWithInterest})

  return {
    monthlyPayment: monthlyP,
    totalWithInterest: totalPriceWithInterest,
    extraMonthlyPayment: monthlyP + extraPayment,
    interestSum: interestAmount,
    // Total amount payed totalPriceWithInterest + down payment
  totalAmountPaid: totalPriceWithInterest + obj.downPayment
  };
}

// this function envokes the getMonthlyPayment function and adds the the extra payment to the monthlyPayment
// export function getExtraMonthlyPayment(extraPayment: number, obj: LoanObj) {
//   const monthlyPayment = getMonthlyPayment(obj)?.monthlyPayment;

//   if (!monthlyPayment) return;

//   const extraP = monthlyPayment + extraPayment;
//   return extraP;
// }

// This function will return the number of months it will require to pay off loan with extra payments
export function solveForNumberOfMonths(obj: LoanObj, extraPayment: number) {
  if (obj.downPayment > obj.carPrice) return;

  const loanAmount = obj.carPrice - obj.downPayment;
  const monthlyPayment = getMonthlyPayment(obj, extraPayment)?.extraMonthlyPayment;

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
    numberOfMonths: numberOfMonths,
    numberOfMonthsNoRounding: Number((topLog / bottomLog).toFixed(4)),
  };
}

// This function is a for loop and loops over the new number of months adjusted with the extra payments ... the higher extra payment the smaller number of months
// This returns ammorization scheldule of all the payments
export function loanAmmortizationWithExtraPayment(obj: LoanObj, extraPayment: number) {
  if (obj.downPayment > obj.carPrice) return;

  let loanAmount = obj.carPrice - obj.downPayment;
  const rate = obj.rate / 100;
  const monthlyPayment = getMonthlyPayment(obj, extraPayment)?.extraMonthlyPayment;
  const time = solveForNumberOfMonths(obj, extraPayment)?.numberOfMonths;
  const res = [];

  if (!monthlyPayment || !time) return;

  for (let i = 0; i <= time; i++) {
    if (i >= 1) {
      let loanAmountTimesRate = (loanAmount * rate) / 12;
      let moneyTowardsPrincipal = monthlyPayment - loanAmountTimesRate;
      loanAmount = loanAmount - moneyTowardsPrincipal;
      res.push({
        time: i,
        price: loanAmount >= 0 ? loanAmount : 0,
      });
    }
  }
  //console.log(monthlyPayment);
  //console.log(res);
  return res;
}

// Loan js 3rd party ... just returns array of ammoriation schedule ... link explaining how to create ammortization 
//* https://www.fool.com/the-ascent/personal-finance/how-is-loan-amortization-schedule-calculated/#:~:text=Starting%20in%20month%20one%2C%20take,is%20what%20goes%20toward%20principal.
export function loanAmmortization(obj: LoanObj) {
  if (obj.downPayment > obj.carPrice) return;

  let loanAmount = obj.carPrice - obj.downPayment;

  const loan = new Loan(
    loanAmount, // amount
    obj.time, // installments number
    obj.rate, // interest rate
    "annuity" // loanType: 'annuity' | 'annuityDue' | 'diminishing' | GetNextInstalmentPartFunction
  );
  const monthlyPayment = getMonthlyPayment(obj, 0)?.monthlyPayment;
  const rate = obj.rate / 100;
  const res = []

  if (!monthlyPayment) return;

  for(let i =0; i<= obj.time; i++){
    if(i >= 1){
      let loanAmountTimesRate = (loanAmount * rate) / 12;
      let moneyTowardsPrincipal = monthlyPayment - loanAmountTimesRate;
      loanAmount = loanAmount - moneyTowardsPrincipal

      res.push({
        time: i,
        price: loanAmount >= 0 ? loanAmount : 0,
      });
    }
  }


  //return loan
  //* Im going to return the loanjs and my own for loop ... just to make sure I get the same values ... making sure my numbers are accurate
  return {
    thirdPartyLoan:loan,
    myLoan:res
  }
}

export function getExtraPaymentTotalPaid(months: number, monthlyP: number, downPayment: number, carPrice: number) {
  if (!months || !monthlyP! || !downPayment === undefined || !carPrice) return { nonFormattedValue: 0, formattedValue: "", interestNonFormattedValue: "", interestFormattedValue: 0 };

  const value = months * monthlyP + downPayment;
  const value2 = Number(Math.abs(value - carPrice));

  return {
    nonFormattedValue: value,
    formattedValue: USDollar.format(Number(value.toFixed(2))),
    interestNonFormattedValue: value2,
    interestFormattedValue: USDollar.format(Number(value2.toFixed(2))),
  };
}
