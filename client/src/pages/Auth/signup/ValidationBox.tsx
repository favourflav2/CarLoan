import * as React from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { validationCheck } from "../utils/ValidationCheckFunc";

export interface IValidationBoxProps {
  setHideVal: React.Dispatch<React.SetStateAction<boolean>>;
  hideVal: boolean;
  allInputData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}

export default function ValidationBox({ setHideVal, hideVal, allInputData }: IValidationBoxProps) {
 



  return (
    <>
      <AnimatePresence>
        {!hideVal && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { duration: 0.2, ease: easeInOut } }}
            exit={{ opacity: [1, 0.8, 0.5, 0], transition: { duration: 0.4, ease: easeInOut } }}
            className={`w-full h-auto mt-2`}
          >
            {/* Content */}
            <div className="w-full h-auto grid grid-cols-1">
              {/* Upper Case */}
              <div className="w-full flex items-center">
                {validationCheck(allInputData.password).upperCase ? <CheckIcon className="text-green-400 sm:text-base text-[16px]" /> : <CloseIcon className="text-red-500 sm:text-base text-[16px]"/>}
                <p className="sm:text-[13px] text-[12px] ml-2">Must have 1 Upper Case Alphabet</p>
              </div>
              {/* Lower Case */}
              <div className="w-full flex items-center">
                {validationCheck(allInputData.password).lowerCase ? <CheckIcon className="text-green-400 sm:text-base text-[16px]" /> : <CloseIcon className="text-red-500 sm:text-base text-[16px]"/>}
                <p className="sm:text-[13px] text-[12px] ml-2">Must have 1 Lower Case Alphabet</p>
              </div>

              {/* Numeral Case */}
              <div className="w-full flex items-center">
                {validationCheck(allInputData.password).totalNumber ? <CheckIcon className="text-green-400 sm:text-base text-[16px]" /> : <CloseIcon className="text-red-500 sm:text-base text-[16px]"/>}
                <p className="sm:text-[13px] text-[12px] ml-2">Must have 1 Numeral Case Alphabet</p>
              </div>

              {/* Min Num */}
              <div className="w-full flex items-center">
                {validationCheck(allInputData.password).minLength ? <CheckIcon className="text-green-400 sm:text-base text-[16px]" /> : <CloseIcon className="text-red-500 sm:text-base text-[16px]"/>}
                <p className="sm:text-[13px] text-[12px] ml-2">Minimum 8 characters</p>
              </div>

              {/* Max Num */}
              <div className="w-full flex items-center">
                {validationCheck(allInputData.password).maxLength ? <CheckIcon className="text-green-400 sm:text-base text-[16px]" /> : <CloseIcon className="text-red-500 sm:text-base text-[16px]"/>}
                <p className="sm:text-[13px] text-[12px] ml-2">Max 20 characters</p>
              </div>

              {/* Special Character */}
              <div className="w-full flex items-center">
                {validationCheck(allInputData.password).specialCh ? <CheckIcon className="text-green-400 sm:text-base text-[16px]" /> : <CloseIcon className="text-red-500 sm:text-base text-[16px]"/>}
                <p className="sm:text-[13px] text-[12px] ml-2">Must have 1 Special Character[-@&*^#]</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
