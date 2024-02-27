import { Modal } from "@mui/material";
import * as React from "react";
import { motion } from "framer-motion";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import { Dispatch } from "../../redux/store";
import { setRetireModal } from "../../redux/features/applicationSlice";


export interface IFirstModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FirstModal({ open, setOpen }: IFirstModalProps) {
    const dispatch = Dispatch()
  return (
    <Modal onClose={() => setOpen(false)} open={open}>
      <div className=" absolute top-[50%] left-[50%] transfrom -translate-x-[50%] -translate-y-[50%]  dark:bg-homeBg bg-lightHomeBg lg:w-[30%] md:w-[40%] sm:w-[45%] 2xl:w-[25%] w-full rounded-lg">
        {/* Content */}
        <motion.div 
        className="w-full h-full  flex flex-col p-4 dark:text-homeText text-lightSmallNavBarBg"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.3,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        >
            {/* First Box */}
            <div className="w-full justify-between flex items-center">
        <h1 className=" text-[22px] font-medium">Select Your Goal</h1>
        <CloseOutlinedIcon onClick={()=>setOpen(false)}/>
            </div>

            <hr className="my-2 border dark:border-darkSelectedColor border-lightSelectedColor"/>

            {/* Second Box */}
            <div className="w-auto flex flex-col h-auto">

                <div className="w-auto flex items-center my-3 cursor-pointer" >
                    <h1 className="underline text-[17px] font-medium" onClick={()=>{
                    setOpen(false)
                    dispatch(setRetireModal(true))
                }}>Retirement</h1>
                    <NavigateNextOutlinedIcon className="text-[19px]" onClick={()=>{
                    setOpen(false)
                    dispatch(setRetireModal(true))
                }}/>
                </div>

                <div className="w-auto flex items-center my-3 cursor-pointer">
                    <h1 className="underline text-[17px] font-medium">House</h1>
                    <NavigateNextOutlinedIcon className="text-[19px]"/>
                </div>

                <div className="w-auto flex items-center my-3 cursor-pointer">
                    <h1 className="underline text-[17px] font-medium">Car</h1>
                    <NavigateNextOutlinedIcon className="text-[19px]"/>
                </div>

                <div className="w-auto flex items-center my-3 cursor-pointer">
                    <h1 className="underline text-[17px] font-medium">Other</h1>
                    <NavigateNextOutlinedIcon className="text-[19px]"/>
                </div>
            </div>
          
        </motion.div>
      </div>
    </Modal>
  );
}
