import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { Modal } from "@mui/material";
import { setAnyTypeOfModal } from "../../redux/features/applicationSlice";
import { useMultiStepForm } from "../hooks/useMultiStep";
import House1st from "../multiStepDivs/houseDivs/House1st";

export interface IHouseModalProps {
  setFirstModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function HouseModal ({setFirstModal}: IHouseModalProps) {
  // Redux States
  const { houseModal } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  // MultiStep
  const { currentStep, currentStepIndex } = useMultiStepForm([<House1st />],0);


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
    open={houseModal}
    onClose={() => {
      dispatch(setAnyTypeOfModal({ value: false, type: "House" }));
    }}
  >
    <div className=" absolute top-[50%] left-[50%] transfrom -translate-x-[50%] -translate-y-[50%]  dark:bg-homeBg bg-lightHomeBg sm:w-[70%] md:w-[60%] xl:w-[50%] 2xl:w-[45%] w-full sm:h-auto h-full  rounded-lg">
      {/* Content */}
      <div className="w-full h-full flex flex-col p-4 overflow-y-auto no-scrollbar" ref={myRef}>
        <div>{currentStep}</div>
        <div className="w-full flex items-center justify-between">
          <div className="w-full h-auto">
            {currentStepIndex === 0 && (
              <button className="w-full p-2 dark:bg-gray-300 bg-black dark:text-black text-gray-300  rounded-lg" onClick={()=>{
                dispatch(setAnyTypeOfModal({ value: false, type: "House" }));
                setFirstModal(true)
              }}>
                Back
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
