import * as React from "react";
import { motion } from "framer-motion";
import { Dispatch } from "../../redux/store";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { setCurrentStepIndexRedux, setRetireModal } from "../../redux/features/applicationSlice";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Tooltip } from "@mui/material";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import dayjs from "dayjs";
import { addRetireGoal } from "../../redux/features/retirementSlice";

// truthy values pass the refine validation ... since preRate.length when empty is 0 ... item.length is not greater than zero ... so en error shows
const schema = z.object({
  age: z
    .object({
      currentAge: z
        .number({
          required_error: "Please enter a number between 18 and 80",
          invalid_type_error: "Please enter a number between 18 and 80",
        })
        .min(18, { message: "Please enter a number between 18 and 80" })
        .max(80, { message: "Please enter a number between 18 and 80" }),

      retireAge: z
        .number({
          required_error: "Please enter a number",
          invalid_type_error: "Please enter a number",
        })
        .max(90, { message: "90 is the max age" }),

      lifeExpectancy: z
        .number({
          required_error: "Please enter a number",
          invalid_type_error: "Please enter a number",
        })
        .max(120, { message: "120 is the max age" }),
    })
    .refine(({ currentAge, retireAge }) => currentAge <= retireAge - 1, {
      message: "Your retirement age must be higher than your current age",
      path: ["retireAge"],
    })
    .refine(({ retireAge, lifeExpectancy }) => retireAge <= lifeExpectancy - 1, {
      message: "Your retirement age must be higher than your current age",
      path: ["lifeExpectancy"],
    }),
  savings: z
    .string({
      required_error: "Please enter a number",
    })
    .refine((item) => item.length > 0, {
      message: "Please enter a number",
    }),
  monthlyContribution: z
    .string({
      required_error: "Please enter a number",
    })
    .refine((item) => item.length > 0, {
      message: "Please enter a number",
    }),
  budget: z
    .string({
      required_error: "Please enter a number",
    })
    .refine((item) => item.length > 0, {
      message: "Please enter a number",
    }),
  preRate: z
    .string({
      required_error: "Please enter a number between 0% and 15%",
    })
    .refine((item) => Number(item.replace("%", "")) < 16, {
      message: "Please enter a number between 0% and 15%",
    })
    .refine((item) => item.length > 0, {
      message: "Please enter a number between 0% and 15%",
    }),
  postRate: z
    .string({
      required_error: "Please enter a number between 0% and 15%",
    })
    .refine((item) => Number(item.replace("%", "")) < 16, {
      message: "Please enter a number between 0% and 15%",
    })
    .refine((item) => item.length > 0, {
      message: "Please enter a number between 0% and 15%",
    }),
  inflation: z
    .string({
      required_error: "Please enter a number between 0% and 15%",
    })
    .refine((item) => Number(item.replace("%", "")) < 16, {
      message: "Please enter a number between 0% and 15%",
    })
    .refine((item) => item.length > 0, {
      message: "Please enter a number between 0% and 15%",
    }),
  id: z.string().optional(),
  title: z.string({
    required_error: "Please enter a title",
  }).max(18,{
    message:"Max length is 18"
  }).min(4,{
    message: 'Min length is 4'
  })
});

type FormFields = z.infer<typeof schema>;

export default function Retire2nd() {
  // Redux States
  const dispatch = Dispatch();

  // Form Feilds
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormFields>({
    mode: "all",
    defaultValues: {
      age: {
        currentAge: 23,
        retireAge: 67,
        lifeExpectancy: 90,
      },
      preRate: "6%",
      postRate: "5%",
      inflation: "3%",
    },
    resolver: zodResolver(schema),
  });

  // Advanced Details State
  const [details, setDetails] = React.useState(false);

  // Helper functions
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const date = new Date();
    data.id = dayjs(date).format("MMM D, YYYY h:mm:ss")

    dispatch(addRetireGoal(data));
    dispatch(setCurrentStepIndexRedux("back"));
    dispatch(setRetireModal(false));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.3,
      }}
      className="w-full h-full overflow-y-auto"
    >
      {/* Content */}
      <div className="w-full h-full flex flex-col dark:text-homeText text-lightSmallNavBarBg ">
        {/* First Box */}
        <div className="w-full justify-between flex items-center ">
          <h1 className=" text-[22px] font-medium">Retirement Details</h1>
          <CloseOutlinedIcon
            onClick={() => {
              dispatch(setRetireModal(false));
              dispatch(setCurrentStepIndexRedux("back"));
            }}
          />
        </div>

        <hr className="my-2 border dark:border-darkSelectedColor border-lightSelectedColor" />

        <form className="w-full flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>

            {/* Add A Title */}
            <div className="w-full mb-10 flex justify-center items-center h-auto flex-col">
                <label htmlFor="" className="text-[12px]">Title</label>
                <input type="text" placeholder="Title" className="bg-inherit border-[1px] border-gray-500/20 dark:focus:outline-lightHomeText focus:outline-gray-400    rounded-lg p-3 " {...register("title")}/>
                {errors?.title && <p className="text-red-500 text-[13px] ">{errors?.title?.message}</p>}
            </div>

          <div className=" w-full h-auto grid lg:grid-cols-3 grid-cols-1 gap-5 mb-3">
            {/* Current Age */}
            <div className="w-auto flex flex-col">
              <label className="text-[13.5px] mb-1" htmlFor="age">
                Current Age
              </label>
              <input
                type="number"
                {...register("age.currentAge", {
                  valueAsNumber: true,
                })}
                placeholder="Age"
                className={`p-3 outline-none bg-lightBoxBgDropDown dark:bg-boxBg rounded-sm dark:placeholder:text-gray-700 placeholder:text-gray-500 ${
                  errors?.age?.currentAge && "border-2 border-red-500"
                }`}
              />

              {errors?.age?.currentAge && <p className="text-red-500 text-[13px] ">{errors?.age?.currentAge?.message}</p>}
            </div>

            {/* Savings */}
            <div className="w-auto flex flex-col">
              <label className="text-[13.5px] mb-1" htmlFor="">
                Current retirement savings
                <Tooltip
                  placement="top"
                  title={<h1 className="text-[12.5px]">This is the total of all your retirement savings, including your 401(k) and IRA balances plus other savings earmarked for retirement.</h1>}
                >
                  <HelpOutlineIcon className="!text-[16px] ml-[1px]" />
                </Tooltip>
              </label>
              <Controller
                name="savings"
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <NumericFormat
                    className={`p-3 outline-none bg-lightBoxBgDropDown dark:bg-boxBg rounded-sm dark:placeholder:text-gray-700 placeholder:text-gray-500 ${errors.savings && "border-2 border-red-500"}`}
                    prefix="$"
                    placeholder="Current Savings"
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    autoComplete="off"
                    getInputRef={ref}
                    {...rest}
                  />
                )}
              />
              {errors.savings && <p className="text-red-500 text-[13px] ">{errors.savings?.message}</p>}
            </div>

            {/* Monthly contribution */}
            <div className="w-auto flex flex-col">
              <label className="text-[13.5px] mb-1" htmlFor="">
                Monthly contribution
              </label>
              <Controller
                name="monthlyContribution"
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <NumericFormat
                    className={`p-3 outline-none bg-lightBoxBgDropDown dark:bg-boxBg rounded-sm dark:placeholder:text-gray-700 placeholder:text-gray-500 ${
                      errors.monthlyContribution && "border-2 border-red-500"
                    }`}
                    prefix="$"
                    placeholder="Monthly contribution"
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    autoComplete="off"
                    getInputRef={ref}
                    {...rest}
                  />
                )}
              />
              {errors.monthlyContribution && <p className="text-red-500 text-[13px] ">{errors.monthlyContribution?.message}</p>}
            </div>

            {/* Budget */}
            <div className="w-auto flex flex-col">
              <label className="text-[13.5px] mb-1" htmlFor="">
                Monthly budget in retirement
              </label>
              <Controller
                name="budget"
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <NumericFormat
                    className={`p-3 outline-none bg-lightBoxBgDropDown dark:bg-boxBg rounded-sm dark:placeholder:text-gray-700 placeholder:text-gray-500 ${errors.budget && "border-2 border-red-500"}`}
                    prefix="$"
                    placeholder="Budget in retirement"
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    autoComplete="off"
                    getInputRef={ref}
                    {...rest}
                  />
                )}
              />
              {errors.budget && <p className="text-red-500 text-[13px] ">{errors.budget?.message}</p>}
            </div>

            {/* Retirement Age */}
            <div className="w-auto flex flex-col">
              <label className="text-[13.5px] mb-1" htmlFor="">
                Retirement Age
                <Tooltip
                  placement="top"
                  title={<h1 className="text-[12.5px]">If you were born in 1960 or later, 67 is when you can retire with full benefits. Of course, the longer you work, the more you can save.</h1>}
                >
                  <HelpOutlineIcon className="!text-[16px] ml-[1px]" />
                </Tooltip>
              </label>
              <input
                type="number"
                {...register("age.retireAge", {
                  valueAsNumber: true,
                })}
                placeholder="Retire Age"
                className={`p-3 outline-none bg-lightBoxBgDropDown dark:bg-boxBg rounded-sm dark:placeholder:text-gray-700 placeholder:text-gray-500 ${
                  errors?.age?.retireAge && "border-2 border-red-500"
                }`}
              />

              {errors?.age?.retireAge && <p className="text-red-500 text-[13px] ">{errors?.age.retireAge?.message}</p>}
            </div>

            {/* Life expectancy */}
            <div className="w-auto flex flex-col">
              <label className="text-[13.5px] mb-1" htmlFor="">
                Life expectancy
                <Tooltip
                  placement="top"
                  title={
                    <h1 className="text-[12.5px]">
                      How long you expect to live, which is also how long you'll need your retirement savings to last. People are living longer and healthier lives, so it's wise to plan for a long
                      retirement.
                    </h1>
                  }
                >
                  <HelpOutlineIcon className="!text-[16px] ml-[1px]" />
                </Tooltip>
              </label>
              <input
                type="number"
                {...register("age.lifeExpectancy", {
                  valueAsNumber: true,
                })}
                placeholder="Life Expectancy"
                className={`p-3 outline-none bg-lightBoxBgDropDown dark:bg-boxBg rounded-sm dark:placeholder:text-gray-700 placeholder:text-gray-500 ${
                  errors?.age?.lifeExpectancy && "border-2 border-red-500"
                }`}
              />

              {errors?.age?.lifeExpectancy && <p className="text-red-500 text-[13px] ">{errors?.age?.lifeExpectancy?.message}</p>}
            </div>
          </div>

          <div className="w-auto flex items-center mt-2 mb-2">
            <h1
              className=" font-bold text-[14px] cursor-pointer hover:underline"
              onClick={() => {
                setDetails((item) => !item);
              }}
            >
              ADVANCED DETAILS
            </h1>
            {details ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </div>

          {details && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.1,
              }}
              className=" w-full h-auto grid lg:grid-cols-3 grid-cols-1 gap-5 mb-3"
            >
              {/* Pre-retirement rate of return */}
              <div className="w-auto flex flex-col">
                <label className="text-[13.5px] mb-1" htmlFor="">
                  Pre-retirement rate of return
                  <Tooltip
                    placement="top"
                    title={
                      <h1 className="text-[12.5px]">
                        What do you expect your investments to earn between now and retirement? Our default of a 6% average annual return is a conservative estimate based on historic returns.
                      </h1>
                    }
                  >
                    <HelpOutlineIcon className="!text-[16px] ml-[1px]" />
                  </Tooltip>
                </label>

                <Controller
                  name="preRate"
                  control={control}
                  render={({ field: { ref, ...rest } }) => (
                    <NumericFormat
                      className={`p-3 outline-none bg-lightBoxBgDropDown dark:bg-boxBg rounded-sm dark:placeholder:text-gray-700 placeholder:text-gray-500 ${
                        errors.preRate && "border-2 border-red-500"
                      }`}
                      suffix="%"
                      placeholder="Pre-retirement rate of return"
                      thousandSeparator=","
                      decimalSeparator="."
                      decimalScale={2}
                      autoComplete="off"
                      getInputRef={ref}
                      {...rest}
                    />
                  )}
                />
                {errors.preRate && <p className="text-red-500 text-[13px] ">{errors.preRate?.message}</p>}
              </div>

              {/* Post-retirement rate of return */}
              <div className="w-auto flex flex-col">
                <label className="text-[13.5px] mb-1" htmlFor="">
                  Post-retirement rate of return
                  <Tooltip
                    placement="top"
                    title={
                      <h1 className="text-[12.5px]">
                        Your rate of return during retirement is typically lower than pre-retirement because most people invest at least a portion of their portfolio in lower-risk investments.
                      </h1>
                    }
                  >
                    <HelpOutlineIcon className="!text-[16px] ml-[1px]" />
                  </Tooltip>
                </label>

                <Controller
                  name="postRate"
                  control={control}
                  render={({ field: { ref, ...rest } }) => (
                    <NumericFormat
                      className={`p-3 outline-none bg-lightBoxBgDropDown dark:bg-boxBg rounded-sm dark:placeholder:text-gray-700 placeholder:text-gray-500 ${
                        errors.postRate && "border-2 border-red-500"
                      }`}
                      suffix="%"
                      placeholder="Post-retirement rate of return"
                      thousandSeparator=","
                      decimalSeparator="."
                      decimalScale={2}
                      autoComplete="off"
                      getInputRef={ref}
                      {...rest}
                    />
                  )}
                />
                {errors.postRate && <p className="text-red-500 text-[13px] ">{errors.postRate?.message}</p>}
              </div>
              <div className="w-auto flex flex-col mb-5 sm:mb-0">
                <label className="text-[13.5px] mb-1" htmlFor="">
                  Inflation rate
                  <Tooltip
                    placement="top"
                    title={<h1 className="text-[12.5px]">We have assumed an inflation rate of 3%. You can adjust this to see how inflation could affect your retirement savings.</h1>}
                  >
                    <HelpOutlineIcon className="!text-[16px] ml-[1px]" />
                  </Tooltip>
                </label>
                <Controller
                  name="inflation"
                  control={control}
                  render={({ field: { ref, ...rest } }) => (
                    <NumericFormat
                      className={`p-3 outline-none bg-lightBoxBgDropDown dark:bg-boxBg rounded-sm dark:placeholder:text-gray-700 placeholder:text-gray-500 ${
                        errors.inflation && "border-2 border-red-500"
                      }`}
                      suffix="%"
                      placeholder="Inflation Rate"
                      thousandSeparator=","
                      decimalSeparator="."
                      decimalScale={2}
                      autoComplete="off"
                      getInputRef={ref}
                      {...rest}
                    />
                  )}
                />
                {errors.inflation && <p className="text-red-500 text-[13px] ">{errors.inflation?.message}</p>}
              </div>
            </motion.div>
          )}

          <div className="w-full h-auto grid grid-cols-2 gap-x-2 mt-5 sm:mb-0 mb-4">
            <button
              type="button"
              className="p-2 border dark:border-gray-600 border-gray-400 w-full rounded-md dark:text-homeText text-lightSmallNavBarBg"
              onClick={() => dispatch(setCurrentStepIndexRedux("back"))}
            >
              Go Back
            </button>
            <button className="p-2 dark:bg-darkSelectedColor bg-lightSelectedColor dark:text-homeText text-lightSmallNavBarBg  w-full rounded-md">Save And Continue</button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
