import * as React from 'react';
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import {  SubmitHandler,UseFormRegister,UseFormHandleSubmit,UseFormSetValue,FieldErrors } from "react-hook-form";

import { motion, AnimatePresence } from "framer-motion";
import { UseSelector } from '../../redux/store';

export interface IEditNameHouseBoxProps {
  editState:boolean;
  register: UseFormRegister<{
    streetAddress: string;
}>;
setEditState: React.Dispatch<React.SetStateAction<boolean>>;
onSubmit: SubmitHandler<{
  streetAddress: string;
}>;
setValue: UseFormSetValue<{
  streetAddress: string;
}>;
handleSubmit: UseFormHandleSubmit<{
  streetAddress: string;
}, {
  streetAddress: string;
}>;
errors: FieldErrors<{
  streetAddress: string;
}>;
saveBtn:boolean;
}

export default function EditNameHouseBox ({editState,register,setEditState,onSubmit,setValue,handleSubmit,errors,saveBtn}: IEditNameHouseBoxProps) {

  // Redux States
  const {selectedGoal} = UseSelector(state => state.app)




  // Function take a string and return upper case at postion [0]
  function upperCaseWords(str: string) {
    const arr = str.split(" ");

    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        arr[i] = arr[i][0].toUpperCase() + arr[i].substring(1);
      }
    }

    if (selectedGoal) {
      return arr.join(" ");
    } else {
      return "";
    }
  }

  if(!selectedGoal || selectedGoal.type !== "House") return null
  return (
    <div className="w-auto flex flex-col">
    {/* Edit Title Container */}
    <div className="w-auto h-auto flex items-center ">
      {editState ? (
        <motion.input
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="outline-chartGreen w-[280px] dark:outline-none indent-1 h-[30px] text-[14px] border border-gray-300 dark:border-none rounded-md dark:text-black"
          type="text"
          {...register("streetAddress")}
        />
      ) : (
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="text-[19px] font-semibold underline inline-block align-bottom"
        >
          {upperCaseWords(selectedGoal?.streetAddress)}{" "}
        </motion.h1>
      )}

      {editState ? (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <CloseIcon
            className="ml-2 text-[22px] cursor-pointer"
            onClick={() => {
              setEditState(false);
              setValue("streetAddress", selectedGoal?.streetAddress);
            }}
          />
        </motion.button>
      ) : (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <EditIcon className="ml-2 text-[22px] cursor-pointer" onClick={() => setEditState(true)} />
        </motion.button>
      )}
    </div>
    {errors?.streetAddress && <p className="text-red-500 text-[13px] ">{errors?.streetAddress?.message}</p>}

    {/* Save Button */}
    <AnimatePresence>
      {saveBtn && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 0.97 }}
          transition={{
            duration: 0.3,
            delay: 0.2,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          exit={{ opacity: 0, scale: 0 }}
          className="w-[100px] text-[14px] mt-2 rounded-lg border-2 border-chartGreen dark:text-white text-black"
          onClick={handleSubmit(onSubmit)}
        >
          Save
        </motion.button>
      )}
    </AnimatePresence>
  </div>
  );
}
