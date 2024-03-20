import * as React from "react";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import FirstModal from "../../components/modals/FirstModal";
import RetireModal from "../../components/modals/RetireModal";
import { Dispatch, UseSelector } from "../../redux/store";
import DashboardMappedData from "../../components/dashboardComponents/DashboardMappedData";
import RetirementPage from "../RetirementPage/RetirementPage";
import { setSelectedGoal, setShrinkDashboard } from "../../redux/features/applicationSlice";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { motion} from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import MobileDrawer from "../../components/Drawer/MobileDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Home() {
  // Redux States
  const { selectedGoal, shrinkDashboardSidebar } = UseSelector((state) => state.app);
  const { retireGoals } = UseSelector((state) => state.retireSlice);
  const dispatch = Dispatch();

  // Media Breakpoint
  const matches = useMediaQuery("(min-width:900px)");

  // Modal States
  const [firstModal, setFirstModal] = React.useState(false);

  // Drawer State Mobile Devices
  const [open, setOpen] = React.useState(false);

  // If theres no saved goals ... going to set selected goal to null
  React.useEffect(() => {
    if (retireGoals.length === 0) {
      dispatch(setSelectedGoal(null));
    }
  }, [dispatch, retireGoals]);

  // If the breakpoint hit/pass 900px we close mobile drawer
  React.useEffect(() => {
    if (matches) {
      setOpen(false);
    }
  }, [matches]);
  return (
    <div className="w-full h-full flex flex-col">
      {/* desktop content */}
      <div className={`w-full h-full min-[900px]:grid hidden ${shrinkDashboardSidebar ? "grid-cols-[40px_1fr]" : "grid-cols-[280px_1fr]"}`}>
        {/* Left Side */}
        {shrinkDashboardSidebar ? (
          // Shrinked Left Side
          <div className=" w-full flex items-center   flex-col p-4 ">
            <NavigateNextIcon className="text-[30px] mr-1 dark:text-darkText  text-lightDashboardText" onClick={() => dispatch(setShrinkDashboard())} />
          </div>
        ) : (
          // Regualr Left Side
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: -200 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              duration: 0.4,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className=" w-full flex flex-col p-4 bg-[#e8e9ed] dark:bg-[#120d0a]"
          >
            {/* Dashboard Title */}
            <div className="w-full h-auto flex items-center justify-between">
              <div className="w-auto flex items-center dark:text-darkText  text-lightDashboardText">
                <GridViewOutlinedIcon className="!text-[25px] mr-1" />
                <h1>Dashboard</h1>
              </div>
              {/* Shrink Btn */}
              <div className="w-auto flex items-center cursor-pointer dark:text-darkText  text-lightDashboardText" onClick={() => dispatch(setShrinkDashboard())}>
                <NavigateBeforeIcon className="!text-[30px] " />
              </div>
            </div>

            {/* Divider */}
            <hr className=" my-4 border-2 dark:border-darkText border-lightDashboardText" />

            {/* Mapped Data When We Data ... Or just a selector that opens up a modal */}
            <div className="w-full h-[600px] overflow-y-auto ">
              <DashboardMappedData setFirstModal={setFirstModal} type="desktop" setOpen={setOpen} />
            </div>
          </motion.div>
        )}

        {/* Right Side */}
        <div className=" w-full h-auto">
          {selectedGoal?.id ? (
            selectedGoal?.type === "Retirement" ? (
              <RetirementPage />
            ) : (
              <div className="text-lightText dark:text-darkText">Going to style dashboard when I have an idea of what to put. So far Ive decided to use csv files from gov finacial page to get data</div>
            )
          ) : (
            <div>Theres no selected goal id</div>
          )}
        </div>
      </div>

      {/* ---------------------------Mobile Content------------------------- */}
      <div className="w-full h-full flex flex-col min-[900px]:hidden">
        <div className=" min-[900px]:hidden block my-3 px-4">
          <MenuIcon className=" dark:text-darkText text-lightText " onClick={() => setOpen(true)} />
        </div>
        {/* Drawer */}
        <MobileDrawer open={open} setOpen={setOpen} setFirstModal={setFirstModal} />
        <div className=" w-full h-auto">
          {selectedGoal?.id ? (
            selectedGoal?.type === "Retirement" ? (
              <RetirementPage />
            ) : (
              <div className="text-lightText dark:text-darkText">Going to style dashboard when I have an idea of what to put. So far Ive decided to use csv files from gov finacial page to get data</div>
            )
          ) : (
            <div>Theres no selected goal id</div>
          )}
        </div>
      </div>

      {/* Modals */}
      <FirstModal open={firstModal} setOpen={setFirstModal} />
      <RetireModal />
    </div>
  );
}


