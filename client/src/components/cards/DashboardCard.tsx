import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import CircleIcon from "@mui/icons-material/Circle";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { setSelectedGoal } from "../../redux/features/applicationSlice";
import { removeRetireItem } from "../../redux/features/modalSlices/retirementSlice";
import { RetirementGoals } from "../../redux/features/modalSlices/retirementSlice";
import { CarObjWithFormattedData, removeCarItem } from "../../redux/features/modalSlices/carModalSlice";
import { HouseObjWithFormattedData } from "../../redux/features/modalSlices/houseSlice";

export interface IDashboardCardProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
}

// trying to figure out how to concat and do a switch case

export default function DashboardCard({ type, setOpen }: IDashboardCardProps) {
  // Redux States
  const { retireGoals } = UseSelector((state) => state.retireSlice);
  const { selectedGoal } = UseSelector((state) => state.app);
  const { carGoals } = UseSelector((state) => state.carModalSlice);
  const { houseGoals } = UseSelector((state) => state.houseSlice);
  const dispatch = Dispatch();

  const concatData: Array<RetirementGoals | CarObjWithFormattedData | HouseObjWithFormattedData> = [...retireGoals, ...carGoals,...houseGoals];

  // ref
  const ref = React.useRef(null);

  // Switch function that use selected goal type as case
  function switchCase(item: RetirementGoals | CarObjWithFormattedData | HouseObjWithFormattedData) {
    switch (item?.type) {
      case "Retirement":
        if (!item) return;
        if (item.type !== "Retirement") return;
        dispatch(setSelectedGoal(null));
        dispatch(removeRetireItem(item));
        break;
      case "Car":
        if (!item) return;
        if (item.type !== "Car") return;
        dispatch(setSelectedGoal(null));
        dispatch(removeCarItem(item));
        break;
      default:
        return;
    }
  }

  // Title
  function title(item: RetirementGoals | CarObjWithFormattedData | HouseObjWithFormattedData) {
    switch (item.type) {
      case "Retirement":
        return item.title;
      case "Car":
        return item.name;
      case "House":
        return item.streetAddress;
      default:
        return;
    }
  }

  // Change Selected Goal backgound color
  function changeBgColor(item: RetirementGoals | CarObjWithFormattedData | HouseObjWithFormattedData, goal: RetirementGoals | CarObjWithFormattedData | HouseObjWithFormattedData | null) {
    if (!goal) return "";
    switch (item.type) {
      case "Retirement":
        if (item.id === goal.id) return "bg-gray-300 dark:bg-black/50";
        break;
      case "Car":
        if (item.id === goal.id) return "bg-gray-300 dark:bg-black/50";
        break;
      case "House":
        if (item.id === goal.id) return "bg-gray-300 dark:bg-black/50";
        break;
      default:
        return;
    }
  }

  
  return (
    <>
      {retireGoals.length > 0 || carGoals.length > 0 || houseGoals.length > 0 ? (
        <div className="mt-4 text-lightText dark:text-darkText">
          {/* Mapped Data */}
          {concatData.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col w-full p-3 cursor-pointer border-b border-gray-400 ${changeBgColor(item, selectedGoal)}`}
              onClick={(e: any) => {
                if (e.target.tagName !== "path") {
                  if (type === "desktop") {
                    dispatch(setSelectedGoal(item));
                  } else {
                    setOpen(false);
                    dispatch(setSelectedGoal(item));
                  }
                }
              }}
            >
              {/* Title and Delete Icon */}
              <div className="w-full justify-between items-center flex ">
                <h1 className="text-[15px] underline">{title(item)}</h1>
                <DeleteIcon
                  ref={ref}
                  className="text-[20px]"
                  onClick={() => {
                    const confirmBox = window.confirm("Do you really want to delete this Crumb?");
                    if (confirmBox === true) {
                      switchCase(item);
                    }
                  }}
                />
              </div>

              {/* Type and Date */}
              <div className="w-full flex justify-between items-center mt-2">
                {/* Retirement */}
                {item.type === "Retirement" && (
                  <div className="w-auto flex items-center ">
                    {selectedGoal?.id === item.id && selectedGoal?.type === "Retirement" && selectedGoal?.title === item.title ? (
                      <CircleIcon className=" text-chartGreen text-[15px] mr-1" />
                    ) : (
                      <CircleOutlinedIcon className=" dark:text-gray-300 text-lightText text-[15px] mr-1" />
                    )}

                    <p className="text-[12.5px]">{item.type}</p>
                  </div>
                )}
                {/* Car */}
                {item.type === "Car" && (
                  <div className="w-auto flex items-center ">
                    {selectedGoal?.id === item.id && selectedGoal?.type === "Car" && selectedGoal.name === item.name ? (
                      <CircleIcon className=" text-chartYellow text-[15px] mr-1 mb-[2px]" />
                    ) : (
                      <CircleOutlinedIcon className=" dark:text-gray-300 text-lightText text-[15px] mr-1 mb-[2px]" />
                    )}

                    <p className="text-[12.5px] flex items-center justify-center">{item.type}</p>
                  </div>
                )}

                {/* House */}
                {item.type === "House" && (
                  <div className="w-auto flex items-center ">
                    {selectedGoal?.id === item.id && selectedGoal?.type === "House" && selectedGoal.streetAddress === item.streetAddress ? (
                      <CircleIcon className=" text-blue-500 text-[15px] mr-1 mb-[2px]" />
                    ) : (
                      <CircleOutlinedIcon className=" dark:text-gray-300 text-lightText text-[15px] mr-1 mb-[2px]" />
                    )}

                    <p className="text-[12.5px] flex items-center justify-center">{item.type}</p>
                  </div>
                )}
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

