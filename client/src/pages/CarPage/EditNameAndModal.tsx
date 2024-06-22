import * as React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { carsArr } from '../../components/multiStepDivs/carDivs/CarComponets/carModalSchema';
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { UseSelector } from '../../redux/store';
import {  UseFormSetValue,FieldErrors,UseFormRegister,SubmitHandler, UseFormHandleSubmit } from "react-hook-form";

export interface IEditNameAndModalProps {
    editState: boolean
    allInputData: {
        name: string;
        modal: string;
        img?: any;
    };
    setValue: UseFormSetValue<{
        name: string;
        modal: string;
        img?: any;
    }>
    setEditState: React.Dispatch<React.SetStateAction<boolean>>;
    errors: FieldErrors<{
        name: string;
        modal: string;
        img?: any;
    }>;
    handleChange: (event: SelectChangeEvent) => void;
    saveBtn: boolean;
    register: UseFormRegister<{
        name: string;
        modal: string;
        img?: any;
    }>
    onSubmit: SubmitHandler<{
        name: string;
        modal: string;
        img?: any;
    }>
    handleSubmit: UseFormHandleSubmit<{
        name: string;
        modal: string;
        img?: any;
    }, {
        name: string;
        modal: string;
        img?: any;
    }>
}

export default function EditNameAndModal ({editState,allInputData,setValue, setEditState, errors,handleChange,saveBtn,register,handleSubmit,onSubmit}: IEditNameAndModalProps) {
    // Redux States
    const {selectedGoal} = UseSelector(state => state.app)

    if(!selectedGoal || selectedGoal.type !== "Car") return null
  return (
    <div className="w-auto flex flex-col">
    {/* Edit Title Container */}
    <div className="w-auto h-auto flex  relative">


      {editState ? (
        // If user wants to edit ... show modal and show input
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="w-auto flex flex-col mb-4"
        >
          {/* Modal Select */}
          <div className="w-auto flex flex-col mb-2">
            <label htmlFor="modal" className="text-[12px]">
              Modal
            </label>
            <Select
              label="Modal"
              MenuProps={{ PaperProps: { sx: { maxHeight: 150 } } }}
              sx={{
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                  border: 0,
                },
                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: 0,
                },
              }}
              className="outline-none h-[30px] text-[16px] border border-gray-300 dark:border-none rounded-md dark:text-black bg-white"
              onChange={handleChange}
              value={allInputData.modal}
            >
              {carsArr.map((item: string, index: number) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </div>

          {/* Car Name */}
          <div className="w-auto flex flex-col">
            <label htmlFor="name" className="text-[12px]">
              Name
            </label>
            <input
              className="outline-chartGreen dark:outline-none indent-4 h-[30px] text-[16px] border border-gray-300 dark:border-none rounded-md dark:text-black"
              type="text"
              {...register("name")}
            />
          </div>
        </motion.div>
      ) : (
        // If the edit state is false just show the title
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
         {selectedGoal.modal === "*Other" ? "" : selectedGoal.modal} {selectedGoal.name}
        </motion.h1>
      )}

      {editState ? (
        // If user wants to edit ... cancel icon
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className=" absolute left-[195px]"
        >
          <CloseIcon
            className="ml-2 text-[22px] cursor-pointer"
            onClick={() => {
              setEditState(false);
              setValue("name", selectedGoal?.name);
              setValue("modal",selectedGoal.modal)
            }}
          />
        </motion.button>
      ) : (
        // Edit button
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
    {errors?.name && <p className="text-red-500 text-[13px] ">{errors?.name?.message}</p>}

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
