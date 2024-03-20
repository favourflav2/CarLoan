import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import CircleIcon from "@mui/icons-material/Circle";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { setSelectedGoal } from "../../redux/features/applicationSlice";
import { removeRetireItem } from "../../redux/features/retirementSlice";

export interface IDashboardCardProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  type:string;
}

export default function DashboardCard({type, setOpen}: IDashboardCardProps) {
  // Redux States
  const { retireGoals } = UseSelector((state) => state.retireSlice);
  const { selectedGoal } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  
  return (
    <>
      {retireGoals.length > 0 ? (
        <div className="mt-4">
          {/* Mapped Data */}
          {retireGoals.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col w-full p-3 cursor-pointer border-b  ${
                selectedGoal?.id === item.id && selectedGoal.title === item.title
                  ? " text-chartGreen border-chartGreen dark:bg-inherit bg-white"
                  : "dark:text-gray-300 text-lightText  border-lightText dark:border-gray-300   "
              }`}
              onClick={() => {
                if(type === "desktop"){
                  dispatch(setSelectedGoal(item))
                }else{
                  setOpen(false)
                  dispatch(setSelectedGoal(item))
                }
              }}
            >
              {/* Title and Delete Icon */}
              <div className="w-full justify-between items-center flex">
                <h1 className="text-[15px] underline">{item?.title}</h1>
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

              {/* Type and Date */}
              <div className="w-full flex justify-between items-center mt-2">
                <div className="w-auto flex items-center ">
                  {selectedGoal?.id === item.id && selectedGoal.title === item.title ? (
                    <CircleIcon className=" text-chartGreen text-[15px] mr-1" />
                  ) : (
                    <CircleOutlinedIcon className=" dark:text-gray-300 text-lightText text-[15px] mr-1" />
                  )}

                  <p className="text-[12.5px]">{item.type}</p>
                </div>
                <p className="text-[12.5px] sm:block hidden">{dayjs(item.id).format("MMM D, YYYY h:mm a ")}</p>
                <p className="text-[12.5px] sm:hidden block">{dayjs(item.id).format("M/D/YY h:mm a ")}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
