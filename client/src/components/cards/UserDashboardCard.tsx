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
import { HouseObjWithFormattedData, removeHouseGoal } from "../../redux/features/modalSlices/houseSlice";
import { deleteRetireGoal } from "../../redux/features/tablesSlice";

export interface IUserDashboardCardProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
  selectedGoal: RetirementGoals | null | CarObjWithFormattedData | HouseObjWithFormattedData;
}

export default function UserDashboardCard({ setOpen, type, selectedGoal }: IUserDashboardCardProps) {
  // Redux States
  const { userGoals } = UseSelector((state) => state.tableSlice);
  const { user } = UseSelector((state) => state.auth);
  const dispatch = Dispatch();

  // user Id
  const userId = user?.userObj.id;

  // ref
  const ref = React.useRef(null);

  // Switch function that use selected goal type as case
  //* If the selected goal is the current item we want to deleted we set the selected goal to null and remove the item
  function switchCase(item: RetirementGoals | CarObjWithFormattedData | HouseObjWithFormattedData) {
    switch (item?.type) {
      case "Retirement":
        if (!item) return;
        if (item.type !== "Retirement") return;

        if (userId) {
          if (selectedGoal?.id === item.id) {
            dispatch(setSelectedGoal(null));
            dispatch(deleteRetireGoal({ type: item.type, id: item.id }));
          } else {
            dispatch(deleteRetireGoal({ type: item.type, id: item.id }));
          }
        } else {
          if (selectedGoal?.id === item.id) {
            dispatch(setSelectedGoal(null));
            dispatch(removeRetireItem(item));
          } else {
            dispatch(removeRetireItem(item));
          }
        }

        break;
      case "Car":
        if (!item) return;
        if (item.type !== "Car") return;
        if (selectedGoal?.id === item.id) {
          dispatch(setSelectedGoal(null));
          dispatch(removeCarItem(item));
        } else {
          dispatch(removeCarItem(item));
        }

        break;
      case "House":
        if (!item) return;
        if (item.type !== "House") return;
        if (selectedGoal?.id === item.id) {
          dispatch(setSelectedGoal(null));
          dispatch(removeHouseGoal(item));
        } else {
          dispatch(removeHouseGoal(item));
        }

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
  function changeBgColor(
    item: RetirementGoals | CarObjWithFormattedData | HouseObjWithFormattedData,
    goal: RetirementGoals | CarObjWithFormattedData | HouseObjWithFormattedData | null
  ) {
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

  function renderRightTimeWithObj(item: RetirementGoals | CarObjWithFormattedData | HouseObjWithFormattedData) {
    switch (item.type) {
      case "Retirement":
        if (item.date) {
          return (
            <>
              <p className="text-[12.5px] sm:block hidden">{dayjs(item.date).format("MMM D, YYYY h:mm a ")}</p>
              <p className="text-[12.5px] sm:hidden block">{dayjs(item.date).format("M/D/YY h:mm a ")}</p>
            </>
          );
        } else {
          return (
            <>
              <p className="text-[12.5px] sm:block hidden">{dayjs(item.id).format("MMM D, YYYY h:mm a ")}</p>
              <p className="text-[12.5px] sm:hidden block">{dayjs(item.id).format("M/D/YY h:mm a ")}</p>
            </>
          );
        }
      case "Car":
        return (
          <>
            <p className="text-[12.5px] sm:block hidden">{dayjs(item.id).format("MMM D, YYYY h:mm a ")}</p>
            <p className="text-[12.5px] sm:hidden block">{dayjs(item.id).format("M/D/YY h:mm a ")}</p>
          </>
        );
      case "House":
        return (
          <>
            <p className="text-[12.5px] sm:block hidden">{dayjs(item.id).format("MMM D, YYYY h:mm a ")}</p>
            <p className="text-[12.5px] sm:hidden block">{dayjs(item.id).format("M/D/YY h:mm a ")}</p>
          </>
        );
      default:
        return;
    }
  }

  return (
    <>
      {userGoals.data.length ? (
        <div className=" text-lightText dark:text-darkText">
          {/* Mapped Data */}
          {userGoals.data.map((item) => (
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
                    const confirmBox = window.confirm("Do you really want to delete this goal?");
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
                {renderRightTimeWithObj(item)}
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
