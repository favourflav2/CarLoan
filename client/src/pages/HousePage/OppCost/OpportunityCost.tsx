import * as React from "react";
import { UseSelector } from "../../../redux/store";
import FivePercentRule from "../components/FivePercentRule";
import OwnVsRent from "../components/OwnVsRent";
import { HouseObjWithFormattedData } from "../../../redux/features/modalSlices/houseSlice";
import { opportunityCostSchema } from "./OpportunityCostSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import OppCostInputs from "./OppCostInputs";
import { FTVOppCost, futureValueOfOppCost } from "../../../components/helperFunctions/oppCostFunctions/oppCostFunction";
import { getBreakEvenNumber } from "../components/utils/getBreakEvenNumber";
import OppCostChartContainer from "./OppCostChartContainer";
import { HouseMonthlyPayment } from "../../../components/helperFunctions/loanfunctions/HouseLoanFuntion";


interface Props {
  selectedGoal: HouseObjWithFormattedData;
  monthlyPayment: HouseMonthlyPayment
}


export default function OpportunityCost({ selectedGoal, monthlyPayment }: Props) {
  const { interest, maintenance, propertyTax, opportunityCostRate, rent, appreciation } = selectedGoal;

  // Chart states
  const [breakEvenOppCost, setBreakEvenOppCost] = React.useState<FTVOppCost>()
  const [rentOppCost, setRentOppCost] = React.useState<FTVOppCost>()
  const [diffOppCost, setDiffOppCost] = React.useState<FTVOppCost>()

  const diffCost = getBreakEvenNumber(selectedGoal).resultNoFormat - selectedGoal.rent

  React.useEffect(()=>{
    setBreakEvenOppCost(futureValueOfOppCost(selectedGoal,"breakEven",getBreakEvenNumber(selectedGoal).resultNoFormat))
    setRentOppCost(futureValueOfOppCost(selectedGoal,"rent",selectedGoal.rent))
    setDiffOppCost(futureValueOfOppCost(selectedGoal,"oppCost-rent",diffCost))
  },[selectedGoal])
  


  
  return (
    <div className={`mt-8 h-auto w-full   flex flex-col items-center justify-center text-black dark:text-gray-300`}>
      {/* Content */}
      <div className="w-full h-full flex flex-col ">

        {/* Own Vs Rent && 5% Rule Box */}
        <div className="h-auto justify-center items-center flex flex-col w-full">
          <div className="min-[900px]:w-[80%] w-[90%] h-full flex flex-col">
            {/* Title */}
            <div className=" w-full flex items-center justify-center ">
              <h1 className="font-bold text-[32px]">Renting vs. buying: A simple calculation to help you decide</h1>
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
              <OppCostInputs selectedGoal={selectedGoal}/>

              {/* Right Side Charts */}
              <OppCostChartContainer breakEvenOppCost={breakEvenOppCost} rentOppCost={rentOppCost} diffOppCost={diffOppCost} selectedGoal={selectedGoal} monthlyPayment={monthlyPayment}/>
            </div>



          </div>
        </div>


      </div>
    </div>
  );
}

// min-[900px]:w-[80%] w-[90%]
