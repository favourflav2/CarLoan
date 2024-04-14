import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { Modal } from "@mui/material";
import { setCurrentStepIndexRedux, setAnyTypeOfModal } from "../../redux/features/applicationSlice";
import { useMultiStepForm } from "../hooks/useMultiStep";
import Retire1st from "../multiStepDivs/retireDivs/retire1st";
import Retire2nd from "../multiStepDivs/retireDivs/retire2nd";
interface Props {
  setFirstModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function RetireModal({setFirstModal}:Props) {
  // Redux States
  const { retireModal} = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  // MultiStep
  const { currentStep, currentStepIndex, next } = useMultiStepForm([<Retire1st />, <Retire2nd />]);

  // ref for scrolling to top
  const myRef = React.useRef<any>(null);

  const executeScroll = () => {
    myRef?.current?.scrollTo(0, 0);
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
    executeScroll();
  }, [currentStepIndex]);
  
  return (
    <Modal
      open={retireModal}
      onClose={() => {
        dispatch(setAnyTypeOfModal({ value: false, type: "Retirement" }));
        dispatch(setCurrentStepIndexRedux("back"));
      }}
    >
      <div className=" absolute top-[50%] left-[50%] transfrom -translate-x-[50%] -translate-y-[50%]  dark:bg-homeBg bg-lightHomeBg sm:w-[70%] md:w-[60%] w-full sm:h-auto h-full  rounded-lg">
        {/* Content */}
        <div className="w-full h-full flex flex-col p-4 overflow-y-auto no-scrollbar" ref={myRef}>
          <div>{currentStep}</div>
          <div className="w-full flex items-center justify-between">
          <div className="w-auto flex justify-start my-5">
            {currentStepIndex === 0 && (
              <button className="p-2 dark:bg-gray-300 bg-black dark:text-black text-gray-300  min-w-[100px] rounded-md" onClick={()=>{
                dispatch(setAnyTypeOfModal({ value: false, type: "Retirement" }));
                setFirstModal(true)
              }}>
                Back
              </button>
            )}
            <></>
          </div>
          <div className="w-auto flex justify-end my-5">
            {currentStepIndex === 0 && (
              <button className="p-2 dark:bg-gray-300 bg-black dark:text-black text-gray-300  min-w-[100px] rounded-md" onClick={next}>
                Next
              </button>
            )}
            <></>
          </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
