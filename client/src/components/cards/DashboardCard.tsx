import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import CircleIcon from "@mui/icons-material/Circle";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { setSelectedGoal } from "../../redux/features/applicationSlice";
import { removeRetireItem } from "../../redux/features/modalSlices/retirementSlice";
import { RetirementGoals } from "../../redux/features/modalSlices/retirementSlice";
import { CarObjWithFormattedData } from "../../redux/features/modalSlices/carModalSlice";

export interface IDashboardCardProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
}

interface Arr {
  data: Array<RetirementGoals | CarObjWithFormattedData>;
}

// trying to figure out how to concat and do a switch case

export default function DashboardCard({ type, setOpen }: IDashboardCardProps) {
  // Redux States
  const { retireGoals } = UseSelector((state) => state.retireSlice);
  const { selectedGoal } = UseSelector((state) => state.app);
  const { carGoals } = UseSelector((state) => state.carModalSlice);
  const dispatch = Dispatch();

  const concatData: Array<RetirementGoals | CarObjWithFormattedData> = [...retireGoals, ...carGoals];
  const selectedType = selectedGoal?.type;

  // ref
  const ref = React.useRef(null);

  // switch case
  // function switchCase(typeOfGoal: string, item:any) {
  //   switch (typeOfGoal) {
  //     case "Retirement":
  //       if(selectedGoal?.type === "Retirement"){
  //         return selectedGoal?.id === item.id && selectedGoal?.title === item?.title
  //         ? " text-chartGreen border-chartGreen dark:bg-inherit bg-white"
  //         : "dark:text-gray-300 text-lightText  border-lightText dark:border-gray-300   ";
  //       }
  //     case "user":
  //       return null
  //     default:
  //       return <div>Error: Invalid User Role</div>;
  //   }
  // }

  return (
    <>
      {retireGoals.length > 0 || carGoals.length > 0 ? (
        <div className="mt-4 bg-red-500">
          {/* Mapped Data */}
          {retireGoals.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col w-full p-3 cursor-pointer border-b  ${selectedType === "Retirement"} `}
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
                <h1 className="text-[15px] underline">{item?.title}</h1>
                <DeleteIcon
                  ref={ref}
                  className="text-[20px]"
                  onClick={() => {
                    const confirmBox = window.confirm("Do you really want to delete this Crumb?");
                    if (confirmBox === true) {
                      dispatch(setSelectedGoal(null));
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

// selectedGoal?.id === item.id && selectedGoal.title === item.title
//                   ? " text-chartGreen border-chartGreen dark:bg-inherit bg-white"
//                   : "dark:text-gray-300 text-lightText  border-lightText dark:border-gray-300   "
