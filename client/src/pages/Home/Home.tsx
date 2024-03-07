import * as React from "react";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import FirstModal from "../../components/modals/FirstModal";
import RetireModal from "../../components/modals/RetireModal";
import { Dispatch, UseSelector } from "../../redux/store";
import DashboardMappedData from "../../components/dashboardComponents/DashboardMappedData";
import RetirementPage from "../RetirementPage/RetirementPage";
import { setSelectedGoal } from "../../redux/features/applicationSlice";

export default function Home() {
  // Redux States
  const { selectedGoal } = UseSelector((state) => state.app);
  const {retireGoals} = UseSelector(state => state.retireSlice)
  const dispatch = Dispatch()

  // Modal States
  const [firstModal, setFirstModal] = React.useState(false);

  // If theres no saved goals ... going to set selected goal to null
  React.useEffect(()=>{
    if(retireGoals.length === 0){
      dispatch(setSelectedGoal(null))
    }
  },[dispatch, retireGoals])
  return (
    <div className="w-full min-h-full  ">
      {/* content */}
      <div className="w-full grid grid-cols-[25%_1fr]">
        {/* Left Side */}
        <div className=" w-full flex flex-col p-4 bg-[#e8e9ed] dark:bg-[#120d0a]">
          {/* Dashboard Title */}
          <div className="w-auto flex items-center dark:text-gray-300  text-lightText">
            <GridViewOutlinedIcon className="!text-[25px] mr-1" />
            <h1>Dashboard</h1>
          </div>

          {/* Divider */}
          <hr className=" my-4 border-2 dark:border-gray-300 border-lightText" />

          {/* Mapped Data When We Data ... Or just a selector that opens up a modal */}
          <div className="w-full h-[600px] overflow-y-auto ">
            <DashboardMappedData setFirstModal={setFirstModal} />
          </div>

          {/* Modals */}
          <FirstModal open={firstModal} setOpen={setFirstModal} />
          <RetireModal />
        </div>

        {/* Right Side */}
        <div className=" w-full h-auto">
          {selectedGoal?.type === "Retirement" ? (
            <RetirementPage />
          ) : (
            <div>Going to style dashboard when I have an idea of what to put. So far Ive decided to use csv files from gov finacial page to get data</div>
          )}
        </div>
      </div>
    </div>
  );
}
// 