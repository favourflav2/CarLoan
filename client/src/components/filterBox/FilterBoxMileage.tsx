import * as React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { Dispatch } from "../../redux/store";
import { setBoxMileage, setCurrentPage } from "../../redux/features/carStateSlice";


export interface IFilterBoxMileageProps {
  lowMileage: number;
  highMileage:number
}

export default function FilterBoxMileage({ lowMileage, highMileage }: IFilterBoxMileageProps) {
  const dispatch = Dispatch();

  return (
    <div
      className=" bg-chartGreen dark:bg-[RGBA(0,163,108,0.2)] text-white  p-2 cursor-pointer rounded-full flex items-center m-1"
      onClick={() => {
        dispatch(setBoxMileage());
        dispatch(setCurrentPage(1))
      }}
    >
      <h1 className=" pl-1 text-[13px] font-semibold">
        <span>
        {lowMileage.toLocaleString()} - {highMileage.toLocaleString()} Mileage
        </span>
      </h1>
      <ClearIcon className="text-[15px] ml-1 mr-1 " />
    </div>
  );
}
