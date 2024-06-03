import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { RetirementGoals } from "../../redux/features/modalSlices/retirementSlice";
import { CarObjWithFormattedData } from "../../redux/features/modalSlices/carModalSlice";
import { HouseObjWithFormattedData } from "../../redux/features/modalSlices/houseSlice";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { motion } from "framer-motion";
import { setSelectedGoal } from "../../redux/features/applicationSlice";

export interface ILoggedUserDashboardMappedDataProps {
  setFirstModal: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;

  // Passing this props from Home... This is for mobile dashboard drawer state
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  selectedGoal: RetirementGoals | null | CarObjWithFormattedData | HouseObjWithFormattedData;
}

export default function LoggedUserDashboardMappedData(props: ILoggedUserDashboardMappedDataProps) {
  // Redux States
  const { user } = UseSelector((state) => state.auth);
  const dispatch = Dispatch();

  // User stuff
  const User = user?.userObj.id;
  return (
  <div>
hey
  </div>
  );
}
