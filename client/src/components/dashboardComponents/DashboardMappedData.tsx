import * as React from "react";
import { RetirementGoals } from "../../redux/features/modalSlices/retirementSlice";
import { CarObjWithFormattedData } from "../../redux/features/modalSlices/carModalSlice";
import { HouseObjWithFormattedData } from "../../redux/features/modalSlices/houseSlice";


import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { motion } from "framer-motion";


import DashboardCard from "../cards/DashboardCard";
import { Dispatch } from "../../redux/store";
import { setSelectedGoal } from "../../redux/features/applicationSlice";

export interface IDashboardMappedDataProps {
  setFirstModal: React.Dispatch<React.SetStateAction<boolean>>;
  type:string

  // Passing this props from Home... This is for mobile dashboard drawer state
  setOpen: React.Dispatch<React.SetStateAction<boolean>>

  selectedGoal: RetirementGoals | null | CarObjWithFormattedData | HouseObjWithFormattedData;
  retireGoals: RetirementGoals[]
  houseGoals: HouseObjWithFormattedData[];
  carGoals: CarObjWithFormattedData[];
  
}

export default function DashboardMappedData({ setFirstModal, type, setOpen, selectedGoal, retireGoals, houseGoals, carGoals }: IDashboardMappedDataProps) {
  
const dispatch = Dispatch()
  return (
    <div className="w-full flex flex-col">
      <motion.div
        whileHover={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center w-full p-2 dark:text-darkText text-lightDashboardText border border-lightDashboardText dark:border-darkText rounded-lg justify-center cursor-pointer ${selectedGoal ? 'mb-3': 'mb-0'}`}
        onClick={() => {
          if(type === "desktop"){
            setFirstModal(true);
          }else{
            setOpen(false)
            setFirstModal(true);
          }
        }}
      >
        <h1 className="text-[15px]">Create A Goal</h1>
        <AddOutlinedIcon className="ml-1 !text-[23px]" />
      </motion.div>

      {selectedGoal && <div className="w-full flex items-center justify-center mb-3">
        <p className="underline text-[15px] cursor-pointer" onClick={()=>dispatch(setSelectedGoal(null))}>Need Help ?</p>
      </div>}
      {/* Container For Mapped Data */}
      <div>
        <DashboardCard type={type} setOpen={setOpen} selectedGoal={selectedGoal} retireGoals={retireGoals} houseGoals={houseGoals} carGoals={carGoals}/>
      </div>
    </div>
  );
}
