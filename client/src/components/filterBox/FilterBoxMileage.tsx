import * as React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { Dispatch } from "../../redux/store";
import { returnMileageStatetoNormal } from "../../redux/features/carStateSlice";

export interface IFilterBoxMileageProps {
  item: any;
}

export default function FilterBoxMileage({ item }: IFilterBoxMileageProps) {
  const dispatch = Dispatch();

  return (
    <div
      className=" bg-black text-white p-1 cursor-pointer rounded-full flex items-center m-1"
      onClick={() => {
        dispatch(returnMileageStatetoNormal());
      }}
    >
      <h1 className=" pl-1 text-[13px] font-semibold">
        <span>
          {typeof item.lowMileage === "number" ? `${item.lowMileage} ` : `${item.lowMileage}`} - {typeof item.highMileage === "number" ? `${item.highMileage}` : item.highMileage} Mileage
        </span>
      </h1>
      <ClearIcon className="text-[15px] ml-1 mr-1 " />
    </div>
  );
}
