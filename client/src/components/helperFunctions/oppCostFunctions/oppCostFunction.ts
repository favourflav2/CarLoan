import { HouseObjWithFormattedData } from "../../../redux/features/modalSlices/houseSlice";
import { USDollar } from "../../../pages/CarPage/CarPage";

export interface FTVOppCost {
  data: Array<{ time: number; value: number }>;
  highestNum: string;
  highestNumNoFormat: number;
  totalPrincipal: string;
  totalPrincipalNoFormat: number;
  totalInterst: string;
  totalInterstNoFormat: number;
}

export function futureValueOfOppCost(obj: HouseObjWithFormattedData, type: "breakEven" | "rent" | "oppCost-rent", monthlyPayment: number) {
  const { opportunityCostRate, term, downPayment } = obj;

  const oppRate = opportunityCostRate / 100;
  let res = [];
  let years = 0;

  for (let i = 0; i <= term; i++) {
    //Without making sure i > 0 ... the for loop stopped 1 year short ... now its stops at the right retirement age
    if (i > 0) {
      const amount = downPayment;
      const time = i;
      const monthlyP = monthlyPayment;

      const months = 12;
      const rate = oppRate / months;
      //const c = obj.compound;
      //const equivalentPeriodicRate = Math.pow(1 + rate, c / months) - 1;
      const fvOfPv = amount * Math.pow(1 + rate, time * months);

      const top = Math.pow(1 + rate, time * 12) - 1;
      //console.log(top)
      const value = monthlyP * (top / rate);

      res.push({
        time: (years += 1),
        value: value + fvOfPv,
      });
    }
  }
  const highestNum = Math.max(...res.map((item) => item.value));
  const totalPrincipal = downPayment > 0 ? monthlyPayment * (term * 12) + downPayment : monthlyPayment * (term * 12);
  const totalInterst = highestNum - totalPrincipal;

  return {
    data: res,
    highestNum: USDollar.format(Number(highestNum.toFixed(2))),
    highestNumNoFormat: highestNum,
    totalPrincipal: USDollar.format(Number(totalPrincipal.toFixed(2))),
    totalPrincipalNoFormat: totalPrincipal,
    totalInterst: USDollar.format(Number(totalInterst.toFixed(2))),
    totalInterstNoFormat: totalInterst,
  };
}

export function futureValueOfPresentValue(pv:number,appreciation:number,years:number){
const appreciationRate = appreciation / 100

const rate = appreciationRate / 12
const fvOfPv = pv * Math.pow(1 + rate, years * 12);

 return fvOfPv
}
