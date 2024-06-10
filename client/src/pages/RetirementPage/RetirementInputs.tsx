import * as React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Tooltip } from "@mui/material";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Dispatch, UseSelector } from "../../redux/store";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import { setSelectedGoal } from "../../redux/features/applicationSlice";
import { schema } from "./inputSchema";
import useCheckValidRetire from "./hooks/useCheckValidRetire";
import useHandleUpdate from "./hooks/useHandleUpdate";

type FormFields = z.infer<typeof schema>;

export default function RetirementInputs() {
  // Redux States
  const { selectedGoal } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  // Advanced Details State
  const [details, setDetails] = React.useState(false);

  // Form Feilds
  const {
    register,
    control,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormFields>({
    mode: "all",
    resetOptions: {
      keepErrors: true, // input errors will be retained with value update
    },
    defaultValues: {
      age: {
        currentAge: selectedGoal?.type === "Retirement" && selectedGoal?.currentAge ? selectedGoal.currentAge : 23,
        retireAge: selectedGoal?.type === "Retirement" && selectedGoal?.retireAge ? selectedGoal.retireAge : 67,
        lifeExpectancy: selectedGoal?.type === "Retirement" && selectedGoal?.lifeExpectancy ? selectedGoal.lifeExpectancy : 95,
      },
      preRate: selectedGoal?.type === "Retirement" && selectedGoal?.preRate ? selectedGoal.preRate.toString() : "0",
      postRate: selectedGoal?.type === "Retirement" && selectedGoal?.postRate ? selectedGoal.postRate.toString() : "0",
      inflation: selectedGoal?.type === "Retirement" && selectedGoal?.inflation ? selectedGoal.inflation.toString() : "0",
      savings: selectedGoal?.type === "Retirement" && selectedGoal?.savings ? selectedGoal.savings.toString() : "0",
      monthlyContribution: selectedGoal?.type === "Retirement" && selectedGoal?.monthlyContribution ? selectedGoal.monthlyContribution.toString() : "0",
      budget: selectedGoal?.type === "Retirement" && selectedGoal?.budget ? selectedGoal.budget.toString() : "0",
    },
    resolver: zodResolver(schema),
  });

  const allInputData = watch();
  const errorsArray = Object.keys(errors);

   // show update button
 const {showUpadateBtn} = useCheckValidRetire({selectedGoal,watch})

  

  // Makes Sure inputs match selected goal on page refresh
  React.useEffect(() => {
    if (selectedGoal && selectedGoal?.type === "Retirement") {
      reset({
        age: {
          currentAge: selectedGoal?.currentAge ? selectedGoal.currentAge : 23,
          retireAge: selectedGoal?.retireAge ? selectedGoal.retireAge : 67,
          lifeExpectancy: selectedGoal?.lifeExpectancy ? selectedGoal.lifeExpectancy : 95,
        },
        preRate: selectedGoal?.preRate ? selectedGoal.preRate.toString() : "0",
        postRate: selectedGoal?.postRate ? selectedGoal.postRate.toString() : "0",
        inflation: selectedGoal?.inflation ? selectedGoal.inflation.toString() : "0",
        savings: selectedGoal?.savings ? selectedGoal.savings.toString() : "0",
        monthlyContribution: selectedGoal?.monthlyContribution ? selectedGoal.monthlyContribution.toString() : "0",
        budget: selectedGoal?.budget ? selectedGoal.budget.toString() : "0",
      });
    }
    trigger();
  }, [selectedGoal, reset]); // eslint-disable-line

  // Update Function
  const {handleUpdate} = useHandleUpdate({errorsArray,inputs:allInputData})
  // function handleUpdate() {
  //   if (!selectedGoal?.id || selectedGoal?.type !== "Retirement") return;

  //   if (errorsArray.length) return;

  //   const {
  //     age: { currentAge, lifeExpectancy, retireAge },
  //     monthlyContribution,
  //     preRate,
  //     postRate,
  //     inflation,
  //     budget,
  //     savings,
  //   } = allInputData;
  //   const { title, id, type, showInputs } = selectedGoal;
  //   const newObj: RetirementGoals = {
  //     id,
  //     title,
  //     type,
  //     currentAge,
  //     retireAge,
  //     lifeExpectancy,
  //     budget: parseFloat(budget.replace(/[,%$]/gm, "")),
  //     preRate: parseFloat(preRate.replace(/[,%$]/gm, "")),
  //     postRate: parseFloat(postRate.replace(/[,%$]/gm, "")),
  //     inflation: parseFloat(inflation.replace(/[,%$]/gm, "")),
  //     monthlyContribution: parseFloat(monthlyContribution.replace(/[,%$]/gm, "")),
  //     savings: parseFloat(savings.replace(/[,%$]/gm, "")),
  //     showInputs,
  //     creator:null,
  //     date:null
  //   };

  //   dispatch(editSelectedGoal({ goal: newObj }));
  //   dispatch(editRetireGoal({ id, title, goal: newObj }));
  // }


  if (!selectedGoal || selectedGoal?.type !== "Retirement") {
    dispatch(setSelectedGoal(null));
    return null;
  }

  return (
    <div className="w-full h-full py-4 px-4 min-[900px]:px-3 flex flex-col bg-[#EADDCA] dark:bg-[#1814149c]">
      {/* Content */}
      <div className="w-full flex flex-col">

        <form className="w-full h-auto flex flex-col ">
          {/* Current Age */}
          <div className="w-auto flex flex-col mb-3">
            <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
              Current Age
            </label>
            <input
              type="number"
              {...register("age.currentAge", {
                valueAsNumber: true,
              })}
              className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors?.age?.currentAge && "border-2 border-red-500"}`}
            />
            {errors?.age?.currentAge && <p className="text-red-500 text-[13px] ">{errors?.age?.currentAge?.message}</p>}
          </div>

          {/* Current Savings */}
          <div className="w-auto flex flex-col mb-3">
            <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
              Current Retirement Savings
              <Tooltip
                placement="top"
                title={<h1 className="text-[12.5px]">This is the total of all your retirement savings, including your 401(k) and IRA balances plus other savings earmarked for retirement.</h1>}
              >
                <HelpOutlineIcon className="!text-[15px] ml-[2px]" />
              </Tooltip>
            </label>

            <Controller
              render={({ field: { onChange, value } }) => (
                <NumericFormat
                  className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors.savings && "border-2 border-red-500"}`}
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
              name="savings"
              control={control}
            />

            {errors?.savings && <p className="text-red-500 text-[13px] ">{errors?.savings?.message}</p>}
          </div>

          {/* Monthly Contribution */}
          <div className="w-auto flex flex-col mb-3">
            <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
              Monthly Contribution
            </label>

            <Controller
              render={({ field: { onChange, value } }) => (
                <NumericFormat
                  className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors.monthlyContribution && "border-2 border-red-500"}`}
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
              name="monthlyContribution"
              control={control}
            />
            {errors?.monthlyContribution && <p className="text-red-500 text-[13px] ">{errors?.monthlyContribution?.message}</p>}
          </div>

          {/* Monthly budget in retirement */}
          <div className="w-auto flex flex-col mb-3">
            <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
              Monthly budget in retirement
            </label>

            <Controller
              render={({ field: { onChange, value } }) => (
                <NumericFormat
                  className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors.budget && "border-2 border-red-500"}`}
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
              name="budget"
              control={control}
            />
            {errors?.budget && <p className="text-red-500 text-[13px] ">{errors?.budget?.message}</p>}
          </div>

          {/* Advanced Details Button */}
          <div className="w-auto flex items-center mt-2 mb-2">
            <h1
              className=" font-bold text-[13px] cursor-pointer hover:underline dark:text-gray-300 text-black"
              onClick={() => {
                setDetails((item) => !item);
              }}
            >
              ADVANCED DETAILS
            </h1>
            {details ? <ArrowDropUpIcon className="dark:text-gray-300 text-black" /> : <ArrowDropDownIcon className="dark:text-gray-300 text-black" />}
          </div>

          {/* Advanced Details Box */}
          {details && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.1,
              }}
              className="w-auto flex flex-col"
            >
              {/* Retirement Age */}
              <div className="w-auto flex flex-col mb-3">
                <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
                  Retirement Age
                  <Tooltip
                    placement="top"
                    title={<h1 className="text-[12.5px]">If you were born in 1960 or later, 67 is when you can retire with full benefits. Of course, the longer you work, the more you can save.</h1>}
                  >
                    <HelpOutlineIcon className="!text-[15px] ml-[2px]" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  {...register("age.retireAge", {
                    valueAsNumber: true,
                  })}
                  className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors?.age?.retireAge && "border-2 border-red-500"}`}
                />
                {errors?.age?.retireAge && <p className="text-red-500 text-[13px] ">{errors?.age?.retireAge?.message}</p>}
              </div>

              {/* Life expectancy */}
              <div className="w-auto flex flex-col mb-3">
                <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
                  Life Expectancy
                  <Tooltip
                    placement="top"
                    title={
                      <h1 className="text-[12.5px]">
                        How long you expect to live, which is also how long you'll need your retirement savings to last. People are living longer and healthier lives, so it's wise to plan for a long
                        retirement.
                      </h1>
                    }
                  >
                    <HelpOutlineIcon className="!text-[15px] ml-[2px]" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  {...register("age.lifeExpectancy", {
                    valueAsNumber: true,
                  })}
                  className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors?.age?.lifeExpectancy && "border-2 border-red-500"}`}
                />
                {errors?.age?.lifeExpectancy && <p className="text-red-500 text-[13px] ">{errors?.age?.lifeExpectancy?.message}</p>}
              </div>

              {/* Pre-retirement rate of return */}
              <div className="w-auto flex flex-col mb-3">
                <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
                  Pre-retirement rate of return
                  <Tooltip
                    placement="top"
                    title={
                      <h1 className="text-[12.5px]">
                        What do you expect your investments to earn between now and retirement? Our default of a 6% average annual return is a conservative estimate based on historic returns.
                      </h1>
                    }
                  >
                    <HelpOutlineIcon className="!text-[15px] ml-[2px]" />
                  </Tooltip>
                </label>

                <Controller
                  render={({ field: { onChange, value } }) => (
                    <NumericFormat
                      className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors.preRate && "border-2 border-red-500"}`}
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
                  name="preRate"
                  control={control}
                />
                {errors?.preRate && <p className="text-red-500 text-[13px] ">{errors?.preRate?.message}</p>}
              </div>

              {/* Post-retirement rate of return */}
              <div className="w-auto flex flex-col mb-3">
                <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
                  Post-retirement rate of return
                  <Tooltip
                    placement="top"
                    title={
                      <h1 className="text-[12.5px]">
                        Your rate of return during retirement is typically lower than pre-retirement because most people invest at least a portion of their portfolio in lower-risk investments.
                      </h1>
                    }
                  >
                    <HelpOutlineIcon className="!text-[15px] ml-[2px]" />
                  </Tooltip>
                </label>

                <Controller
                  render={({ field: { onChange, value } }) => (
                    <NumericFormat
                      className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors.postRate && "border-2 border-red-500"}`}
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
                  name="postRate"
                  control={control}
                />
                {errors?.postRate && <p className="text-red-500 text-[13px] ">{errors?.postRate?.message}</p>}
              </div>

              {/* Inflation Rate */}
              <div className="w-auto flex flex-col mb-3">
                <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
                  Inflation Rate
                </label>

                <Controller
                  render={({ field: { onChange, value } }) => (
                    <NumericFormat
                      className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors.inflation && "border-2 border-red-500"}`}
                      suffix="%"
                      thousandSeparator=","
                      decimalSeparator="."
                      decimalScale={2}
                      allowLeadingZeros
                      autoComplete="off"
                      allowNegative={false}
                      onValueChange={(v) => {
                        onChange(v.value);
                      }}
                      value={value}
                    />
                  )}
                  name="inflation"
                  control={control}
                />
                {errors?.inflation && <p className="text-red-500 text-[13px] ">{errors?.inflation?.message}</p>}
              </div>
            </motion.div>
          )}

        
          <AnimatePresence>
            {selectedGoal && showUpadateBtn && (
              <motion.button
                className={` rounded-lg p-1 ${errorsArray.length ? "bg-gray-300 text-gray-400" : "bg-chartGreen text-white"}`}
                type="button"
                onClick={handleUpdate}
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
