import * as React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { Dispatch } from "../../redux/store";
import { setBoxModal } from "../../redux/features/carStateSlice";
import { helpFormatCarNameClient } from "../../pages/ScrapeCarvanaPage/utils/helpFormatCarNameClient";


export interface IFilterBoxProps {
  item: string;
}

export default function FilterBoxMakeAndModal({ item }: IFilterBoxProps) {
  const dispatch = Dispatch();

  return (
    <div
      className=" bg-chartGreen dark:bg-[RGBA(0,163,108,0.2)] text-white  p-2 cursor-pointer rounded-full flex items-center m-1"
      onClick={() => {
        dispatch(setBoxModal(item));
      }}
    >
      <h1 className=" pl-1 text-[13px] font-semibold">{helpFormatCarNameClient(item)}</h1>
      <ClearIcon className="text-[15px] ml-1 mr-1 " />
    </div>
  );
}
