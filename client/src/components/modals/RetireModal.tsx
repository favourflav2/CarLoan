import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { Modal } from "@mui/material";
import { setAnyTypeOfModal } from "../../redux/features/applicationSlice";
import { useMultiStepForm } from "../hooks/useMultiStep";
import Retire1st from "../multiStepDivs/retireDivs/retire1st";
import Retire2nd from "../multiStepDivs/retireDivs/retire2nd";
interface Props {
  setFirstModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RetireModal({ setFirstModal }: Props) {
  // Redux States
  const { retireModal } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  // MultiStep
  const { currentStep, currentStepIndex, next, back, steps } = useMultiStepForm([<Retire1st />, <Retire2nd />], 1);

  // ref for scrolling to top
  const myRef = React.useRef<any>(null);

  const executeScroll = () => {
    myRef?.current?.scrollTo(0, 0);
    // myRef?.current?.scrollIntoView({ behavior: "auto" });
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
    executeScroll();
  }, [currentStepIndex, myRef, next, back]);

  return (
    <Modal
      open={retireModal}
      onClose={() => {
        dispatch(setAnyTypeOfModal({ value: false, type: "Retirement" }));
      }}
    >
      <div
        ref={myRef}
        className=" absolute top-[50%] left-[50%] transfrom -translate-x-[50%] -translate-y-[50%] no-scrollbar dark:bg-homeBg bg-lightHomeBg sm:w-[70%] md:w-[60%] w-full sm:max-h-[95%] sm:h-auto h-full  rounded-lg overflow-y-auto"
      >
        {/* Content */}
        <div className="w-full h-full flex flex-col px-4 py-2 overflow-y-auto no-scrollbar">
          <div className="">{currentStep}</div>

          <div className="w-full flex justify-between items-center my-2">
            <button
              className="p-2 dark:bg-gray-300 bg-black dark:text-black text-gray-300  min-w-[100px] rounded-md"
              onClick={() => {
                if (currentStepIndex === 0) {
                  dispatch(setAnyTypeOfModal({ value: false, type: "Retirement" }));
                  setFirstModal(true);
                } else {
                  back();
                }
              }}
            >
              {" "}
              Back
            </button>
            {currentStepIndex < steps && (
              <button className="p-2 dark:bg-gray-300 bg-black dark:text-black text-gray-300  min-w-[100px] rounded-md" onClick={next}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
