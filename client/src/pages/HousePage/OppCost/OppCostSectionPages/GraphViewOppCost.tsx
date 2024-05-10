import * as React from "react";
import { FTVOppCost } from "../../../../components/helperFunctions/oppCostFunctions/oppCostFunction";
import { HouseObjWithFormattedData } from "../../../../redux/features/modalSlices/houseSlice";
import { HouseMonthlyPayment } from "../../../../components/helperFunctions/loanfunctions/HouseLoanFuntion";
import OppCostChart from "../../../../components/charts/OppCostChart";


export interface IGraphViewOppCostProps {
    breakEvenOppCost: FTVOppCost;
    selectedGoal: HouseObjWithFormattedData;
    monthlyPayment: HouseMonthlyPayment;
    rentOppCost: FTVOppCost;
    diffOppCost: FTVOppCost;
}

export default function GraphViewOppCost({ breakEvenOppCost, selectedGoal, monthlyPayment, rentOppCost, diffOppCost }: IGraphViewOppCostProps) {
  return (
    <div className="w-full h-auto rounded-lg shadow-[0px_6px_15px_0px_#00000024] flex flex-col p-6">
      {/* Title */}
      <div className="flex flex-col w-auto h-auto mb-5">
        <h1 className="text-[26px] font-bold">Rent vs Owning ?</h1>
        <h1 className="text-[13px] italic">* The difference in expected returns between property and stocks represents an opportunity cost</h1>
      </div>

      {/* Explantion */}
      <div className="w-auto flex flex-col h-auto">
        <p className="text-[13.5px] mb-2">~ What if instead of paying the break even per month you invested it ?</p>

        <p className="text-[13.5px] mb-2">~ What if you didn't have to pay rent, instead you invested the amount you would pay in rent in the market ? </p>

        <p className="text-[13.5px] mb-2">
          ~ What if you knew buying wasn’t an option but instead used the 5% rule or something similar and decided to take the monthly cost of owning - the rent you are paying and invested the
          difference ?
        </p>
      </div>

      {/* Chart */}
      {breakEvenOppCost && rentOppCost && diffOppCost && (
        <OppCostChart breakEvenOppCost={breakEvenOppCost} rentOppCost={rentOppCost} diffOppCost={diffOppCost} selectedGoal={selectedGoal} monthlyPayment={monthlyPayment} />
      )}
    </div>
  );
}
