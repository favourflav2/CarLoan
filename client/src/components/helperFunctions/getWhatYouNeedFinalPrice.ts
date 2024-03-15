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


export default function getWhatYouNeedFinalPrice(obj: SelectedGoalType) {
  const {
    age: { retireAge, lifeExpectancy },
    budget,
    postRate,
    inflation,
  } = obj;
  const newPostRate = postRate / 100;
  const newInflation = inflation / 100;

  const time = lifeExpectancy - retireAge;

  const monthlyP = budget;

  const months = 12;
  const addInflationAndPostRate = (1 + newPostRate) / (1 + newInflation) - 1;

  const rate = addInflationAndPostRate / months;

  const toThePowerTop = Math.pow(1 + rate, -time * months);
  const subtractToThePower = 1 - toThePowerTop;
  const top = monthlyP * subtractToThePower;
  const value = top / rate;

  // if inflation and postRate === each ohter it means we have a nomial rate of 0
  const yearlyDeposit = monthlyP * 12;
  const rateOfZero = yearlyDeposit * time;

  const finalPrice = newInflation === newPostRate ? rateOfZero : value;

  return finalPrice;
}
