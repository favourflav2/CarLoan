import { CarObjWithFormattedData } from "../../../redux/features/modalSlices/carModalSlice";
import { HouseObjWithFormattedData } from "../../../redux/features/modalSlices/houseSlice";
import { RetirementGoals } from "../../../redux/features/modalSlices/retirementSlice";
import { toast } from "react-toastify";

export function determineLengthError(arr: Array<RetirementGoals | CarObjWithFormattedData | HouseObjWithFormattedData>) {
  const checkForOneHouseObjs = arr.filter((item) => item.type === "House").length;
  const checkForOneCarObjs = arr.filter((item) => item.type === "Car").length;
  const arrLength = arr.length;

  if (checkForOneCarObjs >= 1 && checkForOneHouseObjs >= 1) {
    // If theres already a car goal and house goal.... throw error
    toast.warn("You are only limited to 4 goals, 1 house goal and 1 car goal per. Please make an account if you would love to create more goals.", {
      theme: "colored",
      autoClose: 12000,
    });
    return false;
  } else if (arrLength >= 4) {
    toast.warn("Please make an account if you would love to create more goals. Currently you are only able to have 4 goals created at a time.", {
      theme: "colored",
      autoClose: 12000,
    });
    return false;
  } else {
    return true;
  }
}
