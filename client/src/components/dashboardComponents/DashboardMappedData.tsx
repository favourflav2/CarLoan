import * as React from "react";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { motion } from "framer-motion";


import DashboardCard from "../cards/DashboardCard";

export interface IDashboardMappedDataProps {
  setFirstModal: React.Dispatch<React.SetStateAction<boolean>>;
  type:string

  // Passing this props from Home... This is for mobile dashboard drawer state
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  
}

export default function DashboardMappedData({ setFirstModal, type, setOpen }: IDashboardMappedDataProps) {
  

  return (
    <div className="w-full flex flex-col">
      <motion.div
        whileHover={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="flex items-center w-full p-2 dark:text-darkText text-lightDashboardText border border-lightDashboardText dark:border-darkText rounded-lg justify-center cursor-pointer"
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
      {/* Container For Mapped Data */}
      <div>
        <DashboardCard type={type} setOpen={setOpen}/>
      </div>
    </div>
  );
}
