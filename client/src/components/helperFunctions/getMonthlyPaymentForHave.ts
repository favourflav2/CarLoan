import getWhatYouNeedFinalPrice from "./getWhatYouNeedFinalPrice";

interface SelectedGoalType {
  type: string;
  id: string;
  age: {
    currentAge: number;
    retireAge: number;
    lifeExpectancy: number;
  };
  savings: number;
  monthlyContribution: number;
  budget: number;
  preRate: number;
  postRate: number;
  inflation: number;
  title: string;
}
//TODO LINK ... https://ua.pressbooks.pub/collegealgebraformanagerialscience/chapter/8-3-payout-annuities/#:~:text=%3DPMT(r%2Fk%2C,compounded%20k%20times%20a%20year.

// Payout Annutiy Function is being used with inflation to calculate monthly withdraw
//* Since we have the present value we solve for W (the monthly withdraw)
export function getMonthlyPaymentForHave(obj: SelectedGoalType, highNum: number) {
  const {
    age: { retireAge, lifeExpectancy },

    postRate,
    inflation,
  } = obj;
  const newPostRate = postRate / 100;
  const newInflation = inflation / 100;

  const time = lifeExpectancy - retireAge;

  const finalPrice = highNum; // PV
  const addInflationAndPostRate = (1 + newPostRate) / (1 + newInflation) - 1;
  const months = 12;
  const rate = addInflationAndPostRate / months;

  const toThePowerTop = Math.pow(1 + rate, -time * months);
  const subtractToThePower = 1 - toThePowerTop;
  const topDivideBottom = subtractToThePower / rate;
  const value = finalPrice / topDivideBottom;

  // This for PMT with not adjusted with infaltion
  const rateNoInflation = newPostRate / months;

  const toThePowerTopNoInflation = Math.pow(1 + rateNoInflation, -time * months);
  const subtractToThePowerNoInflation = 1 - toThePowerTopNoInflation;
  const topDivideBottomNoInflation = subtractToThePowerNoInflation / rateNoInflation;
  const valueNoInflation = finalPrice / topDivideBottomNoInflation;

  // if inflation and postRate === each ohter it means we have a nomial rate of 0
  const numberOfPayments = time * months;
  const pmtZeroInterest = finalPrice / numberOfPayments;

  return {
    value: newInflation === newPostRate ? pmtZeroInterest : value,
    valueNoInflation,
  };
}

// Payout Annutiy for getting montly contribution for what you need final price
export function getMonthlyPaymentForNeed(obj: SelectedGoalType) {
  let monthlyContribution = 0;
  const {
    age: { retireAge, currentAge },

    postRate,
    inflation,
  } = obj;
  const newPostRate = postRate / 100;
  const newInflation = inflation / 100;

  const time = retireAge - currentAge;

  const moneyNeededForBudgetNumber = getWhatYouNeedFinalPrice(obj);
  const addInflationAndPostRate = (1 + newPostRate) / (1 + newInflation) - 1;

  const months = 12;
  const rate = addInflationAndPostRate / months;

  const toThePowerTop = Math.pow(1 + rate, time * months) - 1;
  const topAndBottom = toThePowerTop / rate;

  const PMT = moneyNeededForBudgetNumber / topAndBottom;

  // if inflation and postRate === each ohter it means we have a nomial rate of 0
  const numberOfPayments = time * months;
  const pmtZeroInterest = moneyNeededForBudgetNumber / numberOfPayments;

  monthlyContribution = newInflation === newPostRate ? pmtZeroInterest : PMT;

  return monthlyContribution;
}
