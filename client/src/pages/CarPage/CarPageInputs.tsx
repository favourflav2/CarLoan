import * as React from "react";
import { Dispatch } from "../../redux/store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { carPageSchemaSlider } from "./carPageSchemaSlider";
import { CarObj, CarObjWithFormattedData, carShowInput, editCarGoal } from "../../redux/features/modalSlices/carModalSlice";
import { editSelectedGoal, selectedShowInput } from "../../redux/features/applicationSlice";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { NumericFormat } from "react-number-format";
import _ from "lodash";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useMediaQuery } from "@mui/material";

export interface ICarPageInputsProps {
  selectedGoal: CarObjWithFormattedData;
}

export type IndexNames = "mileage" | "price" | "downPayment" | "interest" | "term" | "salary" | "extraPayment";

type FormFields = z.infer<typeof carPageSchemaSlider>;

export default function CarPageInputs({ selectedGoal }: ICarPageInputsProps) {
  // Redux States
  const dispatch = Dispatch();
  const { showInputs } = selectedGoal;

  // Show Update Btn
  const [showUpadateBtn, setShowUpdateBtn] = React.useState<boolean>(false);

  // Show Inputs on mobile states
  const matches = useMediaQuery("(min-width:1024px)");

  // Form Feilds
  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormFields>({
    mode: "all",
    resetOptions: {
      keepErrors: true, // input errors will be retained with value update
    },
    defaultValues: {
      price: selectedGoal.price.toString(),
      downPayment: selectedGoal.downPayment.toString(),
      interest: selectedGoal.interest.toString(),
      term: selectedGoal.term,
      modal: selectedGoal.modal,
      name: selectedGoal.name,
      img: selectedGoal.img ? selectedGoal.img : "",
      mileage: selectedGoal.mileage.toString(),
      id: selectedGoal.id,
      extraPayment: selectedGoal.extraPayment.toString(),
    },
    resolver: zodResolver(carPageSchemaSlider),
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const { img, id, price, mileage, term, name, modal, downPayment, interest, extraPayment } = data;
    const { showInputs } = selectedGoal;

    const newObj: CarObjWithFormattedData = {
      id,
      name,
      type: "Car",
      price: parseFloat(price.replace(/[,%$]/gm, "")),
      downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
      interest: parseFloat(interest.replace(/[,%$]/gm, "")),
      mileage: parseFloat(mileage.replace(/[,%$]/gm, "")),
      modal,
      term,
      img: img ? img : "",
      extraPayment: parseFloat(extraPayment.replace(/[,%$]/gm, "")),
      showInputs,
      date: null,
      creator: null,
    };

    dispatch(editSelectedGoal({ goal: newObj }));
    dispatch(editCarGoal({ id, goal: newObj }));
  };

  const errorsArray = Object.keys(errors);

  React.useEffect(() => {
    function checkValid(select: CarObjWithFormattedData, inputStates: CarObj | any) {
      const { img, id, price, mileage, term, name, modal, downPayment, interest, extraPayment } = inputStates;
      const { showInputs } = select;

      const obj: CarObjWithFormattedData = {
        id,
        name,
        type: "Car",
        price: parseFloat(price.replace(/[,%$]/gm, "")),
        downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
        interest: parseFloat(interest.replace(/[,%$]/gm, "")),
        mileage: parseFloat(mileage.replace(/[,%$]/gm, "")),
        modal,
        term,
        img: img ? img : "",
        extraPayment: parseFloat(extraPayment.replace(/[,%$]/gm, "")),
        showInputs,
        date: null,
        creator: null,
      };

      const isTheSame = _.isEqual(obj, select);
      if (isTheSame) {
        setShowUpdateBtn(false);
        return false;
      } else {
        setShowUpdateBtn(true);
        return true;
      }
    }
    const subscription = watch((data) => {
      checkValid(selectedGoal, data);
    });
    return () => subscription.unsubscribe();
  }, [watch, selectedGoal]);

  React.useEffect(() => {
    if (selectedGoal && selectedGoal.type === "Car") {
      reset({
        price: selectedGoal.price.toString(),
        downPayment: selectedGoal.downPayment.toString(),
        interest: selectedGoal.interest.toString(),
        term: selectedGoal.term,
        modal: selectedGoal.modal,
        name: selectedGoal.name,
        img: selectedGoal.img,
        mileage: selectedGoal.mileage.toString(),
        id: selectedGoal.id,
        extraPayment: selectedGoal.extraPayment.toString(),
      });
    }
  }, [selectedGoal, reset]);

  React.useEffect(() => {
    if (showInputs === false) {
      if (matches) {
        dispatch(selectedShowInput({ goal: selectedGoal, value: true }));
        dispatch(carShowInput({ id: selectedGoal.id, value: true }));
      }
    }
  }, [matches, showInputs, selectedGoal]); // eslint-disable-line

  return (
    <div className="w-full h-full py-4 px-4 min-[900px]:px-3 flex flex-col bg-[#EADDCA] dark:bg-[#1814149c]">
      {/* Content */}
      <div className="w-full flex flex-col">
        {/* Expand and Shrink Input Section Btn */}
        <div className="flex items-end justify-end w-full h-auto lg:hidden">
          {showInputs ? (
            <KeyboardArrowUpIcon
              className="text-[28px] cursor-pointer"
              onClick={() => {
                dispatch(selectedShowInput({ goal: selectedGoal, value: false }));
                dispatch(carShowInput({ id: selectedGoal.id, value: false }));
              }}
            />
          ) : (
            <KeyboardArrowDownIcon
              className="text-[28px] cursor-pointer"
              onClick={() => {
                dispatch(selectedShowInput({ goal: selectedGoal, value: true }));
                dispatch(carShowInput({ id: selectedGoal.id, value: true }));
              }}
            />
          )}
        </div>
        {showInputs ? (
          <form className="w-full h-auto flex flex-col " onSubmit={handleSubmit(onSubmit)}>
            {/* Price*/}
            <div className="w-auto flex flex-col mb-3">
              <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
                Price
              </label>

              <Controller
                render={({ field: { onChange, value } }) => (
                  <NumericFormat
                    className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${
                      errors.price && "border-2 border-red-500"
                    }`}
                    prefix="$"
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    autoComplete="off"
                    allowNegative={false}
                    onValueChange={(v) => {
                      onChange(v.value);
                    }}
                    value={value}
                  />
                )}
                name="price"
                control={control}
              />

              {errors?.price && <p className="text-red-500 text-[13px] ">{errors?.price?.message}</p>}
            </div>

            {/* Down Payment */}
            <div className="w-auto flex flex-col mb-3">
              <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
                Down Payment
              </label>

              <Controller
                render={({ field: { onChange, value } }) => (
                  <NumericFormat
                    className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${
                      errors.downPayment && "border-2 border-red-500"
                    }`}
                    prefix="$"
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    autoComplete="off"
                    allowNegative={false}
                    onValueChange={(v) => {
                      onChange(v.value);
                    }}
                    value={value}
                  />
                )}
                name="downPayment"
                control={control}
              />
              {errors?.downPayment && <p className="text-red-500 text-[13px] ">{errors?.downPayment?.message}</p>}
            </div>

            {/* Extra Monthly Payment */}
            <div className="w-auto flex flex-col mb-3">
              <label htmlFor="extraPayment" className="text-[12px] dark:text-gray-300 text-black">
                Extra Monthly Payment
              </label>

              <Controller
                render={({ field: { onChange, value } }) => (
                  <NumericFormat
                    className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${
                      errors.extraPayment && "border-2 border-red-500"
                    }`}
                    prefix="$"
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    autoComplete="off"
                    allowNegative={false}
                    onValueChange={(v) => {
                      onChange(v.value);
                    }}
                    value={value}
                  />
                )}
                name="extraPayment"
                control={control}
              />
              {errors?.extraPayment && <p className="text-red-500 text-[13px] ">{errors?.extraPayment?.message}</p>}
            </div>

            {/* Interest Rate */}
            <div className="w-auto flex flex-col mb-3">
              <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
                Interest Rate
              </label>

              <Controller
                render={({ field: { onChange, value } }) => (
                  <NumericFormat
                    className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${
                      errors.interest && "border-2 border-red-500"
                    }`}
                    suffix="%"
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    autoComplete="off"
                    allowNegative={false}
                    onValueChange={(v) => {
                      onChange(v.value);
                    }}
                    value={value}
                  />
                )}
                name="interest"
                control={control}
              />
              {errors?.interest && <p className="text-red-500 text-[13px] ">{errors?.interest?.message}</p>}
            </div>

            {/* Term DropDown */}

            {/* Mileage */}
            <div className="w-auto flex flex-col mb-3">
              <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
                Mileage
              </label>

              <Controller
                render={({ field: { onChange, value } }) => (
                  <NumericFormat
                    className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${
                      errors.mileage && "border-2 border-red-500"
                    }`}
                    prefix="$"
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    autoComplete="off"
                    allowNegative={false}
                    onValueChange={(v) => {
                      onChange(v.value);
                    }}
                    value={value}
                  />
                )}
                name="mileage"
                control={control}
              />
              {errors?.mileage && <p className="text-red-500 text-[13px] ">{errors?.mileage?.message}</p>}
            </div>

            <AnimatePresence>
              {selectedGoal && showUpadateBtn && (
                <motion.button
                  className={` rounded-lg p-1 ${errorsArray.length ? "bg-gray-300 text-gray-400" : "bg-chartGreen text-white"}`}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1, transition: { duration: 0.2, ease: easeInOut } }}
                  exit={{ opacity: [0.8, 0.5, 0], transition: { duration: 0.2, ease: easeInOut } }}
                >
                  Update
                </motion.button>
              )}
            </AnimatePresence>
          </form>
        ) : (
          <div className="flex items-end justify-end w-full h-auto">
            <p
              className="text-[12.5px] underline cursor-pointer"
              onClick={() => {
                dispatch(selectedShowInput({ goal: selectedGoal, value: true }));
                dispatch(carShowInput({ id: selectedGoal.id, value: true }));
              }}
            >
              Show more
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
