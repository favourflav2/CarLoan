import { Drawer } from "@mui/material";
import * as React from "react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import DashboardMappedData from "../dashboardComponents/DashboardMappedData";

export interface IMobileDrawerProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  setFirstModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileDrawer({ open, setOpen, setFirstModal }: IMobileDrawerProps) {
  return (
    <Drawer onClose={() => setOpen(false)} open={open}>
      {/* Content */}
      <div className="sm:w-[320px] w-[250px] h-full bg-[#e8e9ed] dark:bg-[#120d0a]">
        <div className="h-full w-full flex flex-col p-4 ">
          {/* Dashboard Title */}
          <div className="w-full h-auto flex items-center justify-between">
            <div className="w-auto flex items-center dark:text-gray-300  text-lightText">
              <GridViewOutlinedIcon className="!text-[25px] mr-1" />
              <h1>Dashboard</h1>
            </div>
            {/* Shrink Btn */}
            <div className="w-auto flex items-center cursor-pointer dark:text-gray-300  text-lightText">
              <NavigateBeforeIcon className="!text-[30px] " onClick={()=>setOpen(false)}/>
            </div>
          </div>

          {/* Divider */}
          <hr className=" my-4 border-2 dark:border-gray-300 border-lightText" />

          {/* Mapped Data When We Data ... Or just a selector that opens up a modal */}
          <div className="w-full h-[600px] overflow-y-auto ">
            <DashboardMappedData setFirstModal={setFirstModal} type="mobile" setOpen={setOpen}/>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
