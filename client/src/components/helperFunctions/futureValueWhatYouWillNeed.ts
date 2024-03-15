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

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: `USD`,
});

//TODO What Im doing here is getting the what I need price (the final price) ... and I want get an array of the payments by each age

//! Getting Monthly Payments
//* 1.) Calculate the monthly payments for the need final price ... by using FV of payments
//    1a.) FV = PMT * ((1 + rate/months)^ time * months - 1) / (rate / 12)
//* 2.) Final Price = Y * ((1 + rate/months)^ time * months - 1) / (rate / 12)
//    2a.) Since we already know the final price, we instead solve for y which is the PMT

//! Looping over age to return array of PMTs
//* 3.) Now All we do is use the same fourmula we used in the what you have function
//    3a.) We get the future value of the present value + the future value of the payments
//* 4.) We loop over the time (retire age - current age) ... and for each year we push the age and value at that age into an array that has our data for our chart

export default function futureValueWhatYouWillNeed(obj: SelectedGoalType) {
  const {
    age: { currentAge, retireAge },

    postRate,
    inflation,
  } = obj;
  const newPostRate = postRate / 100;
  const newInflation = inflation / 100;

  // Returns Monthly Payment
  function getMonthlyPayment() {
    let monthlyContribution = 0;

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

  // Returns Array of Payments
  let res = [];
  for (let i = 0; i <= retireAge - currentAge; i++) {
    if (i > 0) {
      let age = currentAge;

      const amount = 0;
      const time = i;
      const monthlyP = getMonthlyPayment();

      const months = 12;
      const addInflationAndPostRate = (1 + newPostRate) / (1 + newInflation) - 1;

      const rate = addInflationAndPostRate / months;

      const fvOfPv = amount * Math.pow(1 + rate, time * months);
      const top = Math.pow(1 + rate, time * 12) - 1;
      const value = monthlyP * (top / rate);

      // if inflation and postRate === each ohter it means we have a nomial rate of 0
      const yearlyDeposit = monthlyP * 12;
      const rateOfZero = yearlyDeposit * time;

      res.push({
        age: i === 1 ? currentAge : age + i,
        value: newInflation === newPostRate ? rateOfZero : value + fvOfPv,
      });
    }
  }
  const highestNum = Math.max(...res.map((item) => item.value));

  return {
    data: res,
    highestNum: USDollar.format(highestNum),
    highestNumNoFormat: highestNum,
  };
}
