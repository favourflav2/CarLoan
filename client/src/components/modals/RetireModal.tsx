import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { Modal } from "@mui/material";
import { setCurrentStepIndexRedux, setRetireModal } from "../../redux/features/applicationSlice";
import { useMultiStepForm } from "../hooks/useMultiStep";
import Retire1st from "../multiStepDivs/retire1st";
import Retire2nd from "../multiStepDivs/retire2nd";

export default function RetireModal() {
  // Redux States
  const { retireModal } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  // MultiStep
  const { currentStep, currentStepIndex, next } = useMultiStepForm([<Retire1st />, <Retire2nd />]);
  return (
    <Modal
      open={retireModal}
      onClose={() => {
        dispatch(setRetireModal(false));
        dispatch(setCurrentStepIndexRedux("back"));
      }}
    >
      <div className=" absolute top-[50%] left-[50%] transfrom -translate-x-[50%] -translate-y-[50%]  dark:bg-homeBg bg-lightHomeBg sm:w-[70%] md:w-[60%] w-full sm:h-auto h-full  rounded-lg">
        {/* Content */}
        <div className="w-full h-full flex flex-col p-4 ">
          {currentStep}
          <div className="w-auto flex justify-end my-5">
            {currentStepIndex === 0 && (
              <button
                className="p-2 dark:bg-darkSelectedColor bg-lightSelectedColor dark:text-homeText text-lightSmallNavBarBg  dark:shadow-darkPurpelGlow shadow-lightPurpleGlow min-w-[100px] rounded-md"
                onClick={next}
              >
                Next
              </button>
            )}
            <></>
          </div>
        </div>
      </div>
    </Modal>
  );
}
