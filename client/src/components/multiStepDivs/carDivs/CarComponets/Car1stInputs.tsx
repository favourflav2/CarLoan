import * as React from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Dispatch } from "../../../../redux/store";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Tooltip } from "@mui/material";
import { carModalSchema } from "./carModalSchema";
import dayjs from "dayjs";
import { CarObj, addCarGoal } from "../../../../redux/features/modalSlices/carModalSlice";
import { setAnyTypeOfModal, setSelectedGoalAfterCreate } from "../../../../redux/features/applicationSlice";
import { carsArr } from "./carModalSchema";
export interface ICar1stInputsProps {
  updatedImg: string;
}

type FormFields = z.infer<typeof carModalSchema>;

export const termArr = [36, 48, 60, 72, 84, 96, 108, 120];

export default function Car1stInputs({ updatedImg }: ICar1stInputsProps) {
  // Redux States
  const dispatch = Dispatch();

  // States
  const [openChooseModal, setOpenChooseModal] = React.useState(false);

  // Date
  const date = new Date();
  const dateFormat = dayjs(date).format("MMM D, YYYY h:mm:ss a");

  // Outside Click
  const ref = React.useRef<HTMLDivElement>(null);

  // Form Feilds
  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormFields>({
    mode: "all",
    defaultValues: {
      term: 60,
      extraPayment: "",
    },
    resolver: zodResolver(carModalSchema),
  });
  const watchModal = watch("modal", "Select A Car Modal...");

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const { price, downPayment, interest, term, id, extraPayment, mileage, name, salary, modal, img } = data;

    const newObj:CarObj = {
      price,
      downPayment,
      interest,
      term,
      id,
      extraPayment,
      mileage,
      name,
      salary,
      modal,
      img: img ? img : "",
      showInputs:true,
      type:"Car"
    }
    dispatch(addCarGoal(newObj));

    // Once we have added the new goal to our array ... we want to set selected goal to the new goal the user created
    dispatch(setSelectedGoalAfterCreate(newObj));

    // Close Modal after everything is done
    dispatch(setAnyTypeOfModal({ value: false, type: "Car" }));
  };

  React.useEffect(() => {
    setValue("id", dateFormat);
  }, [setValue, dateFormat]);

  React.useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref?.current?.contains(event.target)) {
        setOpenChooseModal(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [openChooseModal]);

  React.useEffect(() => {
    if (updatedImg) {
      setValue("img", updatedImg);
    } else {
      setValue("img", "");
    }
  }, [updatedImg, setValue]);

  return (
    <form className="w-full h-auto flex flex-col mt-5" onSubmit={handleSubmit(onSubmit)}>
      {/* Input Container */}
      <div className="w-full h-auto grid grid-cols-2 gap-x-4">
        {/* Name */}
        <div className="w-full  flex flex-col mb-3">
          <label htmlFor="name" className="text-[12px] dark:text-gray-300 text-black">
            Car Name
          </label>
          <input
            type="text"
            placeholder="Enter name..."
            {...register("name", {})}
            autoComplete="off"
            className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors?.name && "border-2 border-red-500"}`}
          />
          {errors?.name && <p className="text-red-500 text-[13px] ">{errors?.name?.message}</p>}
        </div>

        {/* Car Modal */}
        <div className="w-full  flex flex-col mb-3 relative ">
          <label htmlFor="name" className="text-[12px] dark:text-gray-300 text-black">
            Car Modal
          </label>
          <div
            className={`outline-none border border-black flex items-center justify-between cursor-pointer  overflow-y-auto  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${
              errors?.modal && "border-2 border-red-500"
            }`}
            onClick={() => setOpenChooseModal((item) => !item)}
          >
            <h1 className={`${watchModal === "Select A Car Modal..." ? "text-gray-400 text-[15px]" : "text-lightText text-base"}`}>
              {watchModal === "MercedesBenz" ? "Mercedes-Benz" : watchModal === "AlfaRomeo" ? "Alfa Romeo" : watchModal}
            </h1>
            {openChooseModal ? <ArrowDropUpIcon className="text-lightText" /> : <ArrowDropDownIcon className="text-lightText" />}
          </div>
          {/* Dropdown */}
          {openChooseModal && (
            <div className=" absolute z-10 w-full h-[200px] border-2 bg-gray-100 rounded-md border-chartGreen  top-[63px] " ref={ref}>
              <div className="w-full h-full flex flex-col overflow-y-auto no-scrollbar">
                {carsArr.map((item: string) => (
                  <div
                    key={item}
                    className="p-1 cursor-pointer transition border border-b  ease-in-out delay-100  hover:bg-gray-400 duration-300 text-lightText"
                    onClick={() => {
                      setValue("modal", item);
                      setOpenChooseModal(false);
                      clearErrors("modal");
                    }}
                  >
                    <h1>{item === "MercedesBenz" ? "Mercedes-Benz" : item === "AlfaRomeo" ? "Alfa Romeo" : item}</h1>
                  </div>
                ))}
              </div>
            </div>
          )}
          {errors?.modal && <p className="text-red-500 text-[13px] ">{errors?.modal?.message}</p>}
        </div>

        {/* Price */}
        <div className="w-full  flex flex-col mb-3">
          <label htmlFor="price" className="text-[12px] dark:text-gray-300 text-black">
            Car Price
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
                placeholder="Enter Price..."
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

        {/* Car Mileage */}
        <div className="w-full  flex flex-col mb-3">
          <label htmlFor="mileage" className="text-[12px] dark:text-gray-300 text-black">
            Car Mileage
          </label>

          <Controller
            render={({ field: { onChange, value } }) => (
              <NumericFormat
                className={`outline-none ${openChooseModal ? "border-none" : "border"} border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${
                  errors.mileage && "border-2 border-red-500"
                }`}
                suffix=" miles"
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                autoComplete="off"
                placeholder="Enter Mileage..."
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

        {/* Down Payment */}
        <div className="w-full  flex flex-col mb-3">
          <label htmlFor="mileage" className="text-[12px] dark:text-gray-300 text-black">
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
                placeholder="Enter a down payment..."
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

        {/* Interest */}
        <div className="w-full  flex flex-col mb-3">
          <label htmlFor="mileage" className="text-[12px] dark:text-gray-300 text-black">
            Interest Rate
          </label>

          <Controller
            render={({ field: { onChange, value } }) => (
              <NumericFormat
                className={`outline-none ${openChooseModal ? "border-none" : "border"} border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${
                  errors.interest && "border-2 border-red-500"
                }`}
                suffix="%"
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                autoComplete="off"
                placeholder="Enter Interest..."
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

        {/* Term in months */}
        <div className="w-full  flex flex-col mb-3">
          <label htmlFor="mileage" className="text-[12px] dark:text-gray-300 text-black">
            Term in (Months)
          </label>

          <select
            id="term"
            className={`outline-none border border-black  dark:border-none py-[8px] px-[6px] text-black mt-1 bg-white placeholder:text-[15px] ${errors.term && "border-2 border-red-500"} `}
            {...register("term", {
              valueAsNumber: true,
            })}
          >
            {termArr.map((item: number) => (
              <option
                key={item}
                onClick={() => {
                  setValue("term", item);
                }}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
          {errors?.term && <p className="text-red-500 text-[13px] ">{errors?.term?.message}</p>}
        </div>

        {/* Retirement Age */}
        <div className="w-auto flex flex-col mb-3">
          <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
            Annual Income
            <Tooltip placement="top" title={<h1 className="text-[12.5px]">How much you make per year.</h1>}>
              <HelpOutlineIcon className="!text-[15px] ml-[2px]" />
            </Tooltip>
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
                placeholder="Enter annual income..."
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
      </div>

      <button className="w-full p-2 rounded-lg mt-2 mb-3 bg-chartYellow dark:text-lightText">Save & Continue</button>
    </form>
  );
}
