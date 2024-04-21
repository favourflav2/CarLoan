export interface HouseLoanObj {
  rate: number;
  time: number;
  downPayment: number;
  price: number;
  propertyTax: number;
  insurance: number;
  mortgageInsurance: number;
}

export function getMonthlyPaymentForHouse(obj: HouseLoanObj, extraPayment: number) {
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

  const totalTaxes = propertyTax + mortgageInsurance + insurance

  // With tax calculations
  const leftTopTax = loanAmount * discountedRate;
  const rightTopTax = Math.pow(1 + discountedRate, time);
  const topTax = leftTopTax * rightTopTax;

  const bottomTax = Math.pow(1 + discountedRate, time) - 1;

  const monthlyPTax = (topTax / bottomTax) + totalTaxes;

  // No tax calculation here
  const leftTop = loanAmount * discountedRate;
  const rightTop = Math.pow(1 + discountedRate, time);
  const top = leftTop * rightTop;

  const bottom = Math.pow(1 + discountedRate, time) - 1;

  const monthlyP = top / bottom;
  const totalPriceWithInterest = monthlyP * time;
  const interestAmount = totalPriceWithInterest - loanAmount;

  

  return {
    monthlyPaymentWithNoTax: {
      monthlyPayment: monthlyP,
      totalWithInterest: totalPriceWithInterest,
      extraMonthlyPayment: monthlyP + extraPayment,
      interestSum: interestAmount,
      // Total amount payed totalPriceWithInterest + down payment
      totalAmountPaid: totalPriceWithInterest + obj.downPayment,
    },
  };
}
