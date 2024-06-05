import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { getAllGoals } from "../../redux/features/tablesSlice";
import { motion } from "framer-motion";
import { RetirementGoals } from "../../redux/features/modalSlices/retirementSlice";
import { CarObjWithFormattedData } from "../../redux/features/modalSlices/carModalSlice";
import { HouseObjWithFormattedData } from "../../redux/features/modalSlices/houseSlice";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { setSelectedGoal } from "../../redux/features/applicationSlice";
import UserDashboardCard from "../cards/UserDashboardCard";
import { CircularProgress } from "@mui/material";

export interface IUserDashBoardMappedDataProps {
  setFirstModal: React.Dispatch<React.SetStateAction<boolean>>;
  type: "desktop" | "mobile";
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedGoal: RetirementGoals | null | CarObjWithFormattedData | HouseObjWithFormattedData;
}

export default function UserDashBoardMappedData({ setFirstModal, type, setOpen, selectedGoal }: IUserDashBoardMappedDataProps) {
  // Redux States
  const dispatch = Dispatch();
  const { pageState, userGoalsLoading } = UseSelector((state) => state.tableSlice);

  

  // Fetch All Goals only when array is empty
  React.useEffect(() => {
    dispatch(getAllGoals({ limit: 10, page: pageState }));
  }, [pageState]); //eslint-disable-line
  return (
    <div className="w-full flex flex-col">
      <motion.div
        whileHover={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center w-full p-2 dark:text-darkText text-lightDashboardText border border-lightDashboardText dark:border-darkText rounded-lg justify-center cursor-pointer ${
          selectedGoal ? "mb-3" : "mb-0"
        }`}
        onClick={() => {
          if (type === "desktop") {
            setFirstModal(true);
          } else {
            setOpen(false);
            setFirstModal(true);
          }
        }}
      >
        <h1 className="text-[15px]">Create A Goal</h1>
        <AddOutlinedIcon className="ml-1 !text-[23px]" />
      </motion.div>

      {selectedGoal && (
        <div className="w-full flex items-center justify-center mb-3">
          <p className="underline text-[15px] cursor-pointer" onClick={() => dispatch(setSelectedGoal(null))}>
            Need Help ?
          </p>
        </div>
      )}

      {/* Container For Mapped Data */}
      <div className={`${!selectedGoal && "mt-3"}`}>
        {userGoalsLoading ? <div className="w-full h-auto flex items-center justify-center my-3"><CircularProgress style={{'color': '#00A36C'}}/></div> : <UserDashboardCard type={type} setOpen={setOpen} selectedGoal={selectedGoal} />}
      </div>
    </div>
  );
}
