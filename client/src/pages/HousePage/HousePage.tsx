import * as React from 'react';
import { Dispatch, UseSelector } from '../../redux/store';
import { setSelectedGoal } from '../../redux/features/applicationSlice';
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import HousePageInputs from './HousePageInputs';

export interface IHousePageProps {
}

export default function HousePage (props: IHousePageProps) {

    // Redux States
    const {selectedGoal, shrinkDashboardSidebar } = UseSelector(state => state.app)
    const dispatch = Dispatch()

    if(!selectedGoal || selectedGoal.type !== "House") {
        dispatch(setSelectedGoal(null));
        return null;
      }
  return (
    <div className="w-full h-full flex flex-col min-[900px]:px-0 px-4">
    {/* Top Section Chart and Inputs */}
    <div
      className={`w-full h-full grid ${
        shrinkDashboardSidebar ? "lg:grid-cols-[280px_1fr] 2xl:grid-cols-[20%_1fr] min-[880px]:grid-cols-[250px_1fr] grid-cols-1" : "lg:grid-cols-[280px_1fr] 2xl:grid-cols-[20%_1fr] grid-cols-1"
      }`}
    >
      {/* Left Side Inputs */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedGoal ? selectedGoal?.streetAddress : "empty"}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-h-[900px]"
        >
          <HousePageInputs />
        </motion.div>
      </AnimatePresence>

      {/* Right Side Chart */}
     <div>
        right side
     </div>
    </div>

    
  </div>
  );
}
