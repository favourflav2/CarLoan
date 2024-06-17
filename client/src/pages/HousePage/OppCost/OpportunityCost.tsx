import * as React from "react";
import FivePercentRule from "../components/FivePercentRule";
import OwnVsRent from "../components/OwnVsRent";
import { HouseObjWithFormattedData } from "../../../redux/features/modalSlices/houseSlice";
import OppCostInputs from "./OppCostInputs";
import { getBreakEvenNumber } from "../components/utils/getBreakEvenNumber";
import OppCostChartContainer from "./OppCostChartContainer";
import { HouseMonthlyPayment } from "../../../components/helperFunctions/loanfunctions/HouseLoanFuntion";
import ThingsToKeepInMind from "../components/ThingsToKeepInMind";
import useHouseOppCostFVFunction from "../hooks/useHouseOppCostFVFunction";

interface Props {
  selectedGoal: HouseObjWithFormattedData;
  monthlyPayment: HouseMonthlyPayment;
}

export default function OpportunityCost({ selectedGoal, monthlyPayment }: Props) {


  const diffCost = React.useMemo(()=>{
return getBreakEvenNumber(selectedGoal).resultNoFormat - selectedGoal.rent
  },[selectedGoal])

  const {breakEvenOppCost, rentOppCost, diffOppCost} = useHouseOppCostFVFunction({selectedGoal, diffCost})



  return (
    <div className={`mt-8 h-auto w-full   flex flex-col items-center justify-center text-black dark:text-gray-300`}>
      {/* Content */}
      <div className="w-full h-full flex flex-col ">
        {/* Own Vs Rent && 5% Rule Box */}
        <div className="h-auto justify-center items-center flex flex-col w-full">
          <div className="min-[900px]:w-[80%] w-[90%] h-full flex flex-col">
            {/* Title */}
            <div className=" w-full flex items-center justify-center ">
              <h1 className="font-bold sm:text-[32px] text-[25px]">Renting vs. buying: A simple calculation to help you decide</h1>
            </div>

            {/* Owning vs Renting */}
            <OwnVsRent />

            {/* 5% Rule */}
            <FivePercentRule />
          </div>
        </div>

        {/* Inputs And Chart Section */}
        <div className="w-full h-auto flex mt-10 mb-[100px]  justify-center">
          {/* Adjust Width Div */}
          <div className="min-[900px]:w-[80%] w-[97%] h-full ">
            {/* Content */}
            <div className={`w-full grid xl:grid-cols-[250px_1fr] grid-cols-1 xl:gap-x-5 gap-y-5 xl:gap-y-0  `}>
              {/* Left Side Inputs */}
              <OppCostInputs selectedGoal={selectedGoal} />

              {/* Right Side Charts */}
              <OppCostChartContainer breakEvenOppCost={breakEvenOppCost} rentOppCost={rentOppCost} diffOppCost={diffOppCost} selectedGoal={selectedGoal} monthlyPayment={monthlyPayment} />
            </div>
          </div>
        </div>

        {/* Summary and Ending */}
        <div className="h-auto justify-center items-center flex flex-col w-full">
          <div className="min-[900px]:w-[80%] w-[90%] h-full flex flex-col">
            {/* Title */}
            <div className=" w-full flex items-center justify-center ">
              <h1 className="font-bold text-[32px]">Summary</h1>
            </div>

            {/* Things to keep in mind */}
            <ThingsToKeepInMind />
          </div>
        </div>
      </div>
    </div>
  );
}


