import { Loan } from "loanjs";

export interface LoanObj {
  rate: number;
  time: number;
  downPayment: number;
  carPrice: number;
}


//* To solve for extra payments all we do is add the extra payment amount to the original payment
// If pur monthly payment is 1000 and our extra payment is 500 ... all we do is add them together to get new monthly payment
//* 1500 ... then we just solve for how much time it will take

// this function grabs the monthly payment ... and adds the the extra payment to the monthlyPayment ... returns an object
export function getMonthlyPayment(obj: LoanObj, extraPayment:number) {
  if (obj.downPayment > obj.carPrice) return;

  const loanAmount = obj.carPrice - obj.downPayment;
  const rate = obj.rate / 100;

  const discountedRate = rate / 12;
  const leftTop = loanAmount * discountedRate;
  const rightTop = Math.pow(1 + discountedRate, obj.time);
  const top = leftTop * rightTop;

  const bottom = Math.pow(1 + discountedRate, obj.time) - 1;

  const monthlyP = top / bottom;
  const totalPriceWithInterest = monthlyP * obj.time + obj.downPayment;

  //console.log({month:monthlyP,total:totalPriceWithInterest})

  return {
    monthlyPayment: monthlyP,
    totalWithInterest: totalPriceWithInterest,
    extraMonthlyPayment: monthlyP + extraPayment
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
  const monthlyPayment = getMonthlyPayment(obj,extraPayment)?.extraMonthlyPayment;

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
    numberOfMonthsNoRounding: Number((topLog / bottomLog).toFixed(4))
  }
}

// This function is a for loop and loops over the new number of months adjusted with the extra payments ... the higher extra payment the smaller number of months
// This returns ammorization scheldule of all the payments
export function loanAmmortizationWithExtraPayment(obj: LoanObj, extraPayment: number) {
  if (obj.downPayment > obj.carPrice) return;

  let loanAmount = obj.carPrice - obj.downPayment;
  const rate = obj.rate / 100;
  const monthlyPayment = getMonthlyPayment(obj,extraPayment)?.extraMonthlyPayment
  const time = solveForNumberOfMonths(obj, extraPayment)?.numberOfMonths
  const res = [];

  if (!monthlyPayment || !time) return;

  for (let i = 0; i <= time; i++) {
    if (i >= 1) {
      let loanAmountTimesRate = (loanAmount * rate) / 12;
      let moneyTowardsPrincipal = monthlyPayment - loanAmountTimesRate;
      loanAmount = (loanAmount - moneyTowardsPrincipal);
      res.push({
        time: i,
        price: loanAmount >= 0 ? loanAmount : 0,
      });
    }
  }
  console.log(monthlyPayment)
  console.log(res)
  return res
}


// Loan js 3rd party ... just returns array of ammoriation schedule
export function loanAmmortization(obj: LoanObj) {
  if (obj.downPayment > obj.carPrice) return;

  const loanAmount = obj.carPrice - obj.downPayment;


  const loan = new Loan(
    loanAmount, // amount
    obj.time, // installments number
    obj.rate, // interest rate
    "annuity" // loanType: 'annuity' | 'annuityDue' | 'diminishing' | GetNextInstalmentPartFunction
  );
  
  //return loan
  console.log(loan)
}
