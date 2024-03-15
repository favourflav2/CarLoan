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

  // TODO LINK ... https://ecampusontario.pressbooks.pub/businessmathtextbook/chapter/11-2-future-value-of-annuities/


  // This function calculates future value of annutiy with monthly payments
  //* 1.) First thing we do is get the future value of the present value
  //  2.) Next we calculate the future value of the montly payments
  //* 3.) Lastly, we just add the future value of the present value + future value of the payments
export default function futureValueWhatYouHave(obj: SelectedGoalType) {
    const {
      age: { currentAge, retireAge },
      savings,
      monthlyContribution,
      preRate,
    } = obj;

    const newPreRate = preRate / 100;
    let res = [];
    for (let i = 0; i <= retireAge - currentAge; i++) {
      //Without making sure i > 0 ... the for loop stopped 1 year short ... now its stops at the right retirement age
      if (i > 0) {
        let age = currentAge;
        const amount = savings;
        const time = i;
        const monthlyP = monthlyContribution;

        const months = 12;
        const rate = newPreRate / months;
        //const c = obj.compound;
        //const equivalentPeriodicRate = Math.pow(1 + rate, c / months) - 1;
        const fvOfPv = amount * Math.pow(1 + rate, time * months);

        const top = Math.pow(1 + rate, time * 12) - 1;
        //console.log(top)
        const value = monthlyP * (top / rate);

        res.push({
          age: i === 1 ? currentAge : age + i,
          value: value + fvOfPv,
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