import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler,Controller } from "react-hook-form";
import { carPageSchemaSlider } from "./carPageSchemaSlider";
import { CarObj, CarObjWithFormattedData, editCarGoal } from "../../redux/features/modalSlices/carModalSlice";
import { editSelectedGoal } from "../../redux/features/applicationSlice";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { NumericFormat } from "react-number-format";
import _ from "lodash";

export interface ICarPageInputsProps {
  //executeScroll: () => void;
}

export type IndexNames = "mileage" | "price" | "downPayment" | "interest" | "term" | "salary" | "extraPayment";

type FormFields = z.infer<typeof carPageSchemaSlider>;

export default function CarPageInputs(props: ICarPageInputsProps) {
  // Redux States
  const { selectedGoal } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  // Show Update Btn
  const [showUpadateBtn, setShowUpdateBtn] = React.useState<boolean>(false);

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
      price: selectedGoal?.type === "Car" && selectedGoal?.price ? selectedGoal.price.toString() : "0",
      downPayment: selectedGoal?.type === "Car" && selectedGoal?.downPayment ? selectedGoal.downPayment.toString() : "0",
      interest: selectedGoal?.type === "Car" && selectedGoal?.interest ? selectedGoal.interest.toString() : "0",
      term: selectedGoal?.type === "Car" && selectedGoal?.term ? selectedGoal.term : 36,
      salary: selectedGoal?.type === "Car" && selectedGoal?.salary ? selectedGoal.salary.toString() : "0",
      modal: selectedGoal?.type === "Car" && selectedGoal?.modal ? selectedGoal.modal : "",
      name: selectedGoal?.type === "Car" && selectedGoal?.name ? selectedGoal.name : "",
      img: selectedGoal?.type === "Car" && selectedGoal?.img ? selectedGoal.img : "",
      mileage: selectedGoal?.type === "Car" && selectedGoal?.mileage ? selectedGoal.mileage.toString() : "0",
      id: selectedGoal?.type === "Car" && selectedGoal?.id ? selectedGoal.id : "",
      extraPayment: selectedGoal?.type === "Car" && selectedGoal?.extraPayment ? selectedGoal.extraPayment.toString() : "",
    },
    resolver: zodResolver(carPageSchemaSlider),
  });

  



  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const { img, id, price, mileage, term, name, modal, downPayment, interest, salary, extraPayment } = data;

    const newObj: CarObjWithFormattedData = {
      id,
      name,
      type: "Car",
      price: parseFloat(price.replace(/[,%$]/gm, "")),
      downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
      interest: parseFloat(interest.replace(/[,%$]/gm, "")),
      mileage: parseFloat(mileage.replace(/[,%$]/gm, "")),
      salary: parseFloat(salary.replace(/[,%$]/gm, "")),
      modal,
      term,
      img: img ? img : "",
      extraPayment: parseFloat(extraPayment.replace(/[,%$]/gm, "")),
    };

    dispatch(editSelectedGoal({ goal: newObj }));
    dispatch(editCarGoal({ id, goal: newObj }));

   
  };

  const errorsArray = Object.keys(errors);

 

  React.useEffect(() => {
    function checkValid(select: CarObjWithFormattedData, inputStates: CarObj | any) {
      if (!select) return false;

      const { img, id, price, mileage, term, name, modal, downPayment, interest, salary, extraPayment } = inputStates;

      const obj: CarObjWithFormattedData = {
        id,
        name,
        type: "Car",
        price: parseFloat(price.replace(/[,%$]/gm, "")),
        downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
        interest: parseFloat(interest.replace(/[,%$]/gm, "")),
        mileage: parseFloat(mileage.replace(/[,%$]/gm, "")),
        salary: parseFloat(salary.replace(/[,%$]/gm, "")),
        modal,
        term,
        img: img ? img : "",
        extraPayment: parseFloat(extraPayment.replace(/[,%$]/gm, "")),
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
      if (!selectedGoal || selectedGoal?.type !== "Car") return;
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
        salary: selectedGoal.salary.toString(),
        modal: selectedGoal.modal,
        name: selectedGoal.name,
        img: selectedGoal.img,
        mileage: selectedGoal.mileage.toString(),
        id: selectedGoal.id,
        extraPayment: selectedGoal.extraPayment.toString(),
      });
    }
  }, [selectedGoal, reset]);

  if (!selectedGoal || selectedGoal.type !== "Car") return null;
  return (
    <div className="w-full h-full py-4 px-4 min-[900px]:px-3 flex flex-col bg-[#EADDCA] dark:bg-[#1814149c]">
    {/* Content */}
    <div className="w-full flex flex-col">

      <form className="w-full h-auto flex flex-col " onSubmit={handleSubmit(onSubmit)}>
       

        {/* Price*/}
        <div className="w-auto flex flex-col mb-3">
          <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
            Price
          </label>

          <Controller
            render={({ field: { onChange, value } }) => (
              <NumericFormat
                className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors.price && "border-2 border-red-500"}`}
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
                className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors.downPayment && "border-2 border-red-500"}`}
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
                className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors.extraPayment && "border-2 border-red-500"}`}
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
                className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors.interest && "border-2 border-red-500"}`}
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
                className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors.mileage && "border-2 border-red-500"}`}
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

        {/* Income */}
        <div className="w-auto flex flex-col mb-3">
          <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
            Income
          </label>

          <Controller
            render={({ field: { onChange, value } }) => (
              <NumericFormat
                className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors.salary && "border-2 border-red-500"}`}
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
            name="salary"
            control={control}
          />
          {errors?.salary && <p className="text-red-500 text-[13px] ">{errors?.salary?.message}</p>}
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

      
    </div>
  </div>
  );
}
