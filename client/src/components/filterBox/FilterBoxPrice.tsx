import * as React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { Dispatch } from "../../redux/store";
import { USDollar } from "../../pages/CarPage/CarPage";
import { setBoxPrice, setCurrentPage } from "../../redux/features/carStateSlice";

//import { returnPriceStateToNormal } from "../../redux/features/carStateSlice";

export interface IFilterBoxProps {
  lowPrice: number;
  highPrice:number
}

export default function FilterBoxPrice({ lowPrice, highPrice }: IFilterBoxProps) {
  const dispatch = Dispatch();

  return (
    <div
      className=" bg-chartGreen dark:bg-[RGBA(0,163,108,0.2)] text-white  p-2 cursor-pointer rounded-full flex items-center m-1"
      onClick={() => {
        dispatch(setBoxPrice());
        dispatch(setCurrentPage(1))
      }}
    >
      <h1 className=" pl-1 text-[13px] font-semibold">
        <span>
          {USDollar.format(lowPrice)} - {USDollar.format(highPrice)} Price
        </span>
      </h1>
      <ClearIcon className="text-[15px] ml-1 mr-1 " />
    </div>
  );
}
