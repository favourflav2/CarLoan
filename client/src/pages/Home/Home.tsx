import * as React from "react";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import FirstModal from "../../components/modals/FirstModal";
import RetireModal from "../../components/modals/RetireModal";
//import { UseSelector } from "../../redux/store";
import DashboardMappedData from "../../components/dashboardComponents/DashboardMappedData";

export default function Home() {


  // Modal States
  const [firstModal, setFirstModal] = React.useState(false);
  return (
    <div className="w-full min-h-full pt-5 ">
      {/* content */}
      <div className="w-full grid grid-cols-[30%_1fr]">
        {/* Left Side */}
        <div className=" w-full flex flex-col p-4">
          {/* Dashboard Title */}
          <div className="w-auto flex items-center dark:text-homeText text-lightSmallNavBarBg">
            <GridViewOutlinedIcon className="!text-[25px] mr-1" />
            <h1>Dashboard</h1>
          </div>

          {/* Divider */}
          <hr className=" my-4 border-2 dark:border-darkSelectedColor border-lightSelectedColor" />

          {/* Mapped Data When We Data ... Or just a selector that opens up a modal */}
          <div className="w-full h-[600px] overflow-y-auto ">
            <DashboardMappedData setFirstModal={setFirstModal}/>
          </div>

          {/* Modals */}
          <FirstModal open={firstModal} setOpen={setFirstModal} />
          <RetireModal />
        </div>

        {/* Right Side */}
        <div className="bg-green-200 p-4">right side</div>
      </div>
    </div>
  );
}
