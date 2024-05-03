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

interface Props {
  selectedGoal: HouseObjWithFormattedData;
}


export default function OpportunityCost({ selectedGoal }: Props) {
  const { interest, maintenance, propertyTax, opportunityCostRate, rent, appreciation } = selectedGoal;
  
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
        <div className="w-full h-auto flex items-center justify-center mt-10 mb-[100px]">
          {/* Adjust Width Div */}
          <div className="min-[900px]:w-[80%] w-[90%] h-full">
            {/* Content */}
            <div className={`w-full grid xl:grid-cols-[330px_1fr] grid-cols-1 xl:gap-x-5 gap-y-5 xl:gap-y-0  `}>
              <OppCostInputs selectedGoal={selectedGoal}/>
              <div className="bg-green-500 w-full h-[200px]">right</div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

// min-[900px]:w-[80%] w-[90%]
