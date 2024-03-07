import * as React from "react";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { motion } from "framer-motion";
import {  UseSelector } from "../../redux/store";

import darkPic from '../../assets/retirePicBlack.svg'
import lightPic from '../../assets/retirePicWhite.svg'
import DashboardCard from "../cards/DashboardCard";

export interface IDashboardMappedDataProps {
  setFirstModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DashboardMappedData({ setFirstModal }: IDashboardMappedDataProps) {
  // Redux State
 
  const {  lightAndDarkMode } = UseSelector((state) => state.app);
 


  return (
   
    
    
   
    <div className="w-full flex flex-col">
      
      <motion.div
        whileHover={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="flex items-center w-full p-2 dark:text-gray-300 text-lightText border border-lightText dark:border-gray-300 rounded-lg justify-center cursor-pointer"
        onClick={() => {
          setFirstModal(true);
        }}
      >
        <h1 className="text-[15px]">Create A Goal</h1>
        <AddOutlinedIcon className="ml-1 !text-[23px]" />
      </motion.div>
      {/* Container For Mapped Data */}
      <div>
        <DashboardCard />
      </div>
    </div>
   
  );
}

