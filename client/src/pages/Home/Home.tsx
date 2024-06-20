import * as React from "react";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SelectGoalModal from "../../components/modals/SelectGoalModal";
import RetireModal from "../../components/modals/RetireModal";
import { Dispatch, UseSelector } from "../../redux/store";
import DashboardMappedData from "../../components/dashboardComponents/DashboardMappedData";
import RetirementPage from "../RetirementPage/RetirementPage";
import { setSelectedGoal, setShrinkDashboard } from "../../redux/features/applicationSlice";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import MobileDrawer from "../../components/Drawer/MobileDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import CarModal from "../../components/modals/CarModal";
import { RetirementGoals } from "../../redux/features/modalSlices/retirementSlice";
import { CarObjWithFormattedData } from "../../redux/features/modalSlices/carModalSlice";
import CarPage from "../CarPage/CarPage";
import HouseModal from "../../components/modals/HouseModal";
import { HouseObjWithFormattedData } from "../../redux/features/modalSlices/houseSlice";
import HousePage from "../HousePage/HousePage";
import NoSelectedGoal from "./NoSelectedGoal";
import UserDashBoardMappedData from "../../components/dashboardComponents/UserDashboardMappedData";
import { Pagination } from "@mui/material";
import { setPageState } from "../../redux/features/tablesSlice";

export default function Home() {
  // Redux States
  const { user } = UseSelector((state) => state.auth);
  const { selectedGoal, shrinkDashboardSidebar, retireModal, carModal, lightAndDarkMode } = UseSelector((state) => state.app);
  const { retireGoals } = UseSelector((state) => state.retireSlice);
  const { carGoals } = UseSelector((state) => state.carModalSlice);
  const { houseGoals } = UseSelector((state) => state.houseSlice);
  const { userGoals, pageState, userGoalsLoading } = UseSelector((state) => state.tableSlice);
  const dispatch = Dispatch();

  // User stuff
  const User = user?.userObj.id;

  // Media Breakpoint
  const matches = useMediaQuery("(min-width:900px)");

  // Modal States
  const [firstModal, setFirstModal] = React.useState(false);

  // Drawer State Mobile Devices
  const [open, setOpen] = React.useState(false);

  // ref to scroll to on handleChange
  const clickRef = React.useRef<any>(null)

  // Handle User Goals Change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setPageState(value))
    clickRef.current?.scrollTo({
      top:0,
      left:0,
      behavior: "smooth"
    })
  };

  function renderSwitch(value: RetirementGoals | null | CarObjWithFormattedData | HouseObjWithFormattedData) {
    switch (value?.type) {
      case "Retirement":
        return <RetirementPage />;
      case "Car":
        return <CarPage />;
      case "House":
        return <HousePage />;
      default:
        return <NoSelectedGoal />;
    }
  }

  //If theres no user id we will check for local storage data ... If theres no saved goals ... going to set selected goal to null
  React.useEffect(() => {
    if (!User) {
      if (retireGoals.length === 0 && carGoals.length === 0 && houseGoals.length === 0) {
        dispatch(setSelectedGoal(null));
      }
    }
  }, [dispatch, retireGoals, carGoals, houseGoals, User]);

  // If the breakpoint hit/pass 900px we close mobile drawer
  React.useEffect(() => {
    if (matches) {
      setOpen(false);
    }
  }, [matches]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* desktop content */}
      <div className="min-[900px]:block hidden">
        <div className={`  ${shrinkDashboardSidebar ? "w-[40px]" : "w-[280px]"} h-full fixed z-10 top-[75px] left-0 overscroll-x-none`}>
          {/* Left Side */}
          {shrinkDashboardSidebar ? (
            // Shrinked Left Side
            <div className=" w-full flex items-center   flex-col p-4 ">
              <NavigateNextIcon
                className="text-[30px] mr-1 dark:text-darkText  text-lightDashboardText"
                onClick={() => dispatch(setShrinkDashboard())}
              />
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
              className=" w-full h-full flex flex-col p-4 bg-[#e8e9ed] dark:bg-[#171717] "
            >
              {/* Dashboard Title */}
              <div className="w-full h-auto flex items-center justify-between">
                <div className="w-auto flex items-center dark:text-darkText  text-lightDashboardText">
                  <GridViewOutlinedIcon className="!text-[25px] mr-1" />
                  <h1>Dashboard</h1>
                </div>
                {/* Shrink Btn */}
                <div
                  className="w-auto flex items-center cursor-pointer dark:text-darkText  text-lightDashboardText"
                  onClick={() => dispatch(setShrinkDashboard())}
                >
                  <NavigateBeforeIcon className="!text-[30px] " />
                </div>
              </div>

              {/* Divider */}
              <hr className=" my-4 border-2 dark:border-darkText border-lightDashboardText" />

              {/* Mapped Data When We Data ... Or just a selector that opens up a modal */}
              <div className={`w-full h-[600px] overflow-y-auto no-scrollbar  ${!userGoalsLoading && userGoals.data.length > 5 && 'border-gray-500 border-b-2 dark:border-white' }`} ref={clickRef}>
                {!User ? (
                  <DashboardMappedData
                    setFirstModal={setFirstModal}
                    type="desktop"
                    setOpen={setOpen}
                    selectedGoal={selectedGoal}
                    retireGoals={retireGoals}
                    houseGoals={houseGoals}
                    carGoals={carGoals}
                  />
                ) : (
                  <UserDashBoardMappedData setFirstModal={setFirstModal} type="desktop" setOpen={setOpen} selectedGoal={selectedGoal}  />
                )}
              </div>

              {/* Pagination */}
              {!userGoalsLoading && userGoals.data.length > 5 && <div className="w-full h-auto mt-5 flex justify-center">
                <Pagination
                  count={userGoals.totalPages || 0}
                  page={pageState}
                  onChange={handlePageChange}
                  className=""
                  size="small"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderColor: `${lightAndDarkMode ? "#d1d5db" : "gray"}`,
                      color: `${lightAndDarkMode ? "#d1d5db" : "black"}`,
                      "&.Mui-selected": {
                        background: `${lightAndDarkMode ? "#d1d5db" : "gray"}`,
                        color: `${lightAndDarkMode ? "black" : "black"}`,
                      },
                    },
                  }}
                />
              </div>}
            </motion.div>
          )}
        </div>
        <div className={`${shrinkDashboardSidebar ? "ml-[40px]" : "ml-[280px]"}`}>
          {/* Right Side */}
          <div className=" w-full h-full">{selectedGoal?.id ? renderSwitch(selectedGoal) : <NoSelectedGoal />}</div>
        </div>
      </div>

      {/* ---------------------------Mobile Content------------------------- */}
      <div className="w-full h-full flex flex-col min-[900px]:hidden">
        <div className=" min-[900px]:hidden block my-3 px-4">
          <MenuIcon className=" dark:text-darkText text-lightText " onClick={() => setOpen(true)} />
        </div>
        {/* Drawer */}
        <MobileDrawer
          open={open}
          setOpen={setOpen}
          setFirstModal={setFirstModal}
          selectedGoal={selectedGoal}
          retireGoals={retireGoals}
          houseGoals={houseGoals}
          carGoals={carGoals}
          User={User}
          clickRef={clickRef}
          handlePageChange={handlePageChange}
        />
        <div className=" w-full h-auto">{selectedGoal?.id ? renderSwitch(selectedGoal) : <NoSelectedGoal />}</div>
      </div>

      {/* Modals */}
      <SelectGoalModal open={firstModal} setOpen={setFirstModal} />
      {retireModal && <RetireModal setFirstModal={setFirstModal} />}
      {carModal && <CarModal setFirstModal={setFirstModal} />}
      <HouseModal setFirstModal={setFirstModal} />
    </div>
  );
}
