import { Drawer, Pagination } from "@mui/material";
import * as React from "react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import DashboardMappedData from "../dashboardComponents/DashboardMappedData";
import { RetirementGoals } from "../../redux/features/modalSlices/retirementSlice";
import { CarObjWithFormattedData } from "../../redux/features/modalSlices/carModalSlice";
import { HouseObjWithFormattedData } from "../../redux/features/modalSlices/houseSlice";
import UserDashBoardMappedData from "../dashboardComponents/UserDashboardMappedData";
import { UseSelector } from "../../redux/store";

export interface IMobileDrawerProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  setFirstModal: React.Dispatch<React.SetStateAction<boolean>>;

  selectedGoal: RetirementGoals | null | CarObjWithFormattedData | HouseObjWithFormattedData;
  retireGoals: RetirementGoals[];
  houseGoals: HouseObjWithFormattedData[];
  carGoals: CarObjWithFormattedData[];
  clickRef: React.MutableRefObject<any>;
  User: string | undefined;
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void
}

export default function MobileDrawer({
  open,
  setOpen,
  setFirstModal,
  selectedGoal,
  retireGoals,
  houseGoals,
  carGoals,
  User,
  clickRef,
  handlePageChange
}: IMobileDrawerProps) {
  const { lightAndDarkMode } = UseSelector((state) => state.app);

  const { userGoals, pageState, userGoalsLoading } = UseSelector((state) => state.tableSlice);

  return (
    <Drawer onClose={() => setOpen(false)} open={open}>
      {/* Content */}
      <div className="sm:w-[320px] w-[250px] h-full bg-[#e8e9ed] dark:bg-[#120d0a]">
        <div className="h-full w-full flex flex-col p-4 ">
          {/* Dashboard Title */}
          <div className="w-full h-auto flex items-center justify-between">
            <div className="w-auto flex items-center dark:text-darkText  text-lightDashboardText">
              <GridViewOutlinedIcon className="!text-[25px] mr-1" />
              <h1>Dashboard</h1>
            </div>
            {/* Shrink Btn */}
            <div className="w-auto flex items-center cursor-pointer dark:text-darkText  text-lightDashboardText">
              <NavigateBeforeIcon className="!text-[30px] " onClick={() => setOpen(false)} />
            </div>
          </div>

          {/* Divider */}
          <hr className=" my-4 border-2 dark:border-darkText border-lightDashboardText" />

          {/* Mapped Data When We Data ... Or just a selector that opens up a modal */}
          <div className="w-full h-[500px] overflow-y-auto" ref={clickRef}>
            {!User ? (
              <DashboardMappedData
                setFirstModal={setFirstModal}
                type="mobile"
                setOpen={setOpen}
                selectedGoal={selectedGoal}
                retireGoals={retireGoals}
                houseGoals={houseGoals}
                carGoals={carGoals}
              />
            ) : (
              <UserDashBoardMappedData setFirstModal={setFirstModal} type="mobile" setOpen={setOpen} selectedGoal={selectedGoal} />
            )}
          </div>

          {/* Pagination */}
        {!userGoalsLoading && userGoals.totalPages && userGoals.totalPages > 1 &&  <div className="w-full h-auto mt-5 flex justify-center">
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
        </div>
      </div>
    </Drawer>
  );
}
