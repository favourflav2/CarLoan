import * as React from "react";
import CircleIcon from "@mui/icons-material/Circle";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { motion } from "framer-motion";
import { Dispatch, UseSelector } from "../../redux/store";
import { removeRetireItem } from "../../redux/features/retirementSlice";
import { setSelectedGoal } from "../../redux/features/applicationSlice";

export interface IDashboardMappedDataProps {
  setFirstModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DashboardMappedData({ setFirstModal }: IDashboardMappedDataProps) {
  // Redux State
  const { retireGoals } = UseSelector((state) => state.retireSlice);
  const { selectedGoal } = UseSelector((state) => state.app);
  const dispatch = Dispatch();
  return (
    <div className="w-full flex flex-col">
      <motion.div
        whileHover={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="flex items-center w-full p-2 dark:text-homeText text-lightSmallNavBarBg border border-lightSelectedColor dark:border-darkSelectedColor rounded-lg justify-center cursor-pointer"
        onClick={() => {
          setFirstModal(true);
        }}
      >
        <h1 className="text-[15px]">Create A Goal</h1>
        <AddOutlinedIcon className="ml-1 !text-[23px]" />
      </motion.div>
      {/* Container For Mapped Data */}
      {retireGoals.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.1,
            delay: 0.3,
            type: "spring",
            damping: 5,
            mass: 0.4,
            stiffness: 100,
          }}
          className="mt-4"
        >
          {/* Mapped Data */}
          {retireGoals.map((item) => (
            <motion.div
              whileHover={{ scale: 0.99 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              className={`flex flex-col w-full p-3 mb-3 dark:text-homeText text-lightSmallNavBarBg border border-lightSelectedColor dark:border-darkSelectedColor rounded-lg  cursor-pointer dark:shadow-[inset_0px_0px_2px_0px_#A84FF7] shadow-[inset_0px_0px_10px_0px_#A2A2E160] ${
                selectedGoal?.id === item.id && selectedGoal.title === item.title && " bg-lightSelectedColor/40 dark:bg-purple-900/40"
              }`}
              onClick={() => dispatch(setSelectedGoal(item))}
            >
              <div className="w-full justify-between items-center flex">
                <h1 className="text-[19px] underline">{item?.title}</h1>
                <DeleteIcon
                  className="text-[20px]"
                  onClick={() => {
                    const confirmBox = window.confirm("Do you really want to delete this Crumb?");
                    if (confirmBox === true) {
                      dispatch(removeRetireItem(item));
                    }
                  }}
                />
              </div>
              <div className="w-full flex justify-between items-center mt-2">
                <div className="w-auto flex items-center ">
                  <CircleIcon className="dark:text-purple-600 text-orange-500 text-[15px] mr-1" />
                  <p className="text-[14.5px]">{item.type}</p>
                </div>
                <p className="text-[14.5px]">{dayjs(item.id).format("MMM D, YYYY h:mm a ")}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <></>
      )}
    </div>
  );
}
