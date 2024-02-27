import * as React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { Dispatch } from "../../redux/store";
import { returnPriceStateToNormal } from "../../redux/features/carStateSlice";

export interface IFilterBoxProps {
  item: any;
}

export default function FilterBoxPrice({ item }: IFilterBoxProps) {
  const dispatch = Dispatch();

  return (
    <div
      className=" bg-black text-white p-1 cursor-pointer rounded-full flex items-center m-1"
      onClick={() => {
        dispatch(returnPriceStateToNormal());
      }}
    >
      <h1 className=" pl-1 text-[13px] font-semibold">
        <span>
          {typeof item.lowPrice === "number" ? `$${item.lowPrice}` : item.lowPrice} - {typeof item.highPrice === "number" ? `$${item.highPrice}` : item.highPrice}
        </span>
      </h1>
      <ClearIcon className="text-[15px] ml-1 mr-1 " />
    </div>
  );
}
