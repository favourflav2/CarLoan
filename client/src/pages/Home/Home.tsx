import * as React from "react";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import FirstModal from "../../components/modals/FirstModal";
import RetireModal from "../../components/modals/RetireModal";
import { Dispatch, UseSelector } from "../../redux/store";
import DashboardMappedData from "../../components/dashboardComponents/DashboardMappedData";
import RetirementPage from "../RetirementPage/RetirementPage";
import { setSelectedGoal, setShrinkDashboard } from "../../redux/features/applicationSlice";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { motion } from "framer-motion";

export default function Home() {
  // Redux States
  const { selectedGoal, shrinkDashboardSidebar } = UseSelector((state) => state.app);
  const { retireGoals } = UseSelector((state) => state.retireSlice);
  const dispatch = Dispatch();

  // Modal States
  const [firstModal, setFirstModal] = React.useState(false);

  // If theres no saved goals ... going to set selected goal to null
  React.useEffect(() => {
    if (retireGoals.length === 0) {
      dispatch(setSelectedGoal(null));
    }
  }, [dispatch, retireGoals]);
  return (
    <div className="w-full min-h-full  ">
      {/* content */}
      <div className={`w-full grid ${shrinkDashboardSidebar ? "grid-cols-[40px_1fr]" : "grid-cols-[280px_1fr]"}`}>
        {/* Left Side */}
        {shrinkDashboardSidebar ? (
          // Shrinked Left Side
          <div className=" w-full flex items-center   flex-col p-4 bg-[#e8e9ed] dark:bg-[#120d0a]">
            <NavigateNextIcon className="text-[30px] mr-1 dark:text-gray-300  text-lightText" onClick={() => dispatch(setShrinkDashboard())} />
          </div>
        ) : (
          // Regualr Left Side
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: -200 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              duration: 0.6,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className=" w-full flex flex-col p-4 bg-[#e8e9ed] dark:bg-[#120d0a]"
          >
            {/* Dashboard Title */}
            <div className="w-full h-auto flex items-end justify-between">
              <div className="w-auto flex items-center dark:text-gray-300  text-lightText">
                <GridViewOutlinedIcon className="!text-[25px] mr-1" />
                <h1>Dashboard</h1>
              </div>
              {/* Shrink Btn */}
              <div className="w-auto flex items-center cursor-pointer" onClick={() => dispatch(setShrinkDashboard())}>
                <FitScreenIcon className="text-[24px] mr-1 dark:text-gray-300  text-lightText" />
                <p className="text-[12.5px] dark:text-gray-300  text-lightText">Shrink</p>
              </div>
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
          </motion.div>
        )}

        {/* Right Side */}
        <div className=" w-full h-auto">
          {selectedGoal?.id ? (
            selectedGoal?.type === "Retirement" ? (
              <RetirementPage />
            ) : (
              <div>Going to style dashboard when I have an idea of what to put. So far Ive decided to use csv files from gov finacial page to get data</div>
            )
          ) : (
            <div>Theres no selected goal id</div>
          )}
        </div>
      </div>
    </div>
  );
}
//
