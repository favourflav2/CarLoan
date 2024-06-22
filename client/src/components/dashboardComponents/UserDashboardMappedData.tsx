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
import { Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate()

  // Fetch All Goals only when array is empty
  React.useEffect(() => {
    dispatch(getAllGoals({ limit: 10, page: pageState }));
  }, [pageState]); //eslint-disable-line
  return (
    <div className="w-full flex flex-col">
      <motion.div
        whileHover={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center w-full p-2 dark:text-darkText text-lightDashboardText border border-lightDashboardText dark:border-darkText rounded-lg justify-center cursor-pointer`}
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

      <div className="w-full h-auto flex flex-col mt-3 mb-4">
        {/* Need help */}
        {selectedGoal && (
          <div className="w-full flex items-center justify-center mb-2">
            <p
              className="underline text-[15px] text-lightText dark:text-darkText cursor-pointer"
              onClick={() => {
                setOpen(false);
                dispatch(setSelectedGoal(null));
              }}
            >
              Need Help ?
            </p>
          </div>
        )}

        {/* How to invest */}
        <div className="w-full flex items-center justify-center">
          <p
            className="underline text-[15px] text-lightText dark:text-darkText cursor-pointer"
            onClick={() => {
              setOpen(false);
              dispatch(setSelectedGoal(null));
              navigate("/home/howToInvest")
            }}
          >
            How to invest ?
          </p>
        </div>
      </div>

      {/* Container For Mapped Data */}
      <div className={`${!selectedGoal && "mt-3"}`}>
        {userGoalsLoading ? (
          <div className="w-full h-auto flex items-center justify-center my-3">
            <div className="w-full grid h-auto">
              {new Array(4).fill("1").map((item: string, index: number) => (
                <Skeleton variant="rectangular" key={index} className="w-full h-[60px] bg-gray-300 dark:bg-gray-700/30 my-1" />
              ))}
            </div>
          </div>
        ) : (
          <UserDashboardCard type={type} setOpen={setOpen} selectedGoal={selectedGoal} />
        )}
      </div>
    </div>
  );
}
