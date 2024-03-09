import * as React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import { Dispatch, UseSelector } from "../../redux/store";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import dayjs from "dayjs";
import { editRetireGoal } from "../../redux/features/retirementSlice";
import { editSelectedGoal } from "../../redux/features/applicationSlice";

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
    .refine(({ currentAge, retireAge }) => currentAge <= retireAge - 1, {
      message: "Your retirement age must be higher than your current age",
      path: ["currentAge"],
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
  title: z
    .string({
      required_error: "Please enter a number between 0% and 15%",
    })
    .max(18, {
      message: "Max length is 18",
    }),
});

type FormFields = z.infer<typeof schema>;

export default function RetirementInputs() {
  // Redux States
  const { selectedGoal } = UseSelector((state) => state.app);
  const dispatch = Dispatch()

  // Id
  const id = selectedGoal?.id
  const title = selectedGoal?.title


  // Advanced Details State
  const [details, setDetails] = React.useState(false);

  // Form Feilds
  const {
    register,
    //handleSubmit,
    control,
    reset,
    trigger,
    formState: { errors },
  } = useForm<FormFields>({
    mode: "all",
    criteriaMode: "all",
    resetOptions: {
      //keepDirtyValues: true, // user-interacted input will be retained
      keepErrors: true, // input errors will be retained with value update
    },
    reValidateMode: "onBlur",
    defaultValues: {
      age: {
        currentAge: selectedGoal?.age?.currentAge ? selectedGoal.age.currentAge : 23,
        retireAge: selectedGoal?.age?.retireAge ? selectedGoal.age.retireAge : 67,
        lifeExpectancy: selectedGoal?.age?.lifeExpectancy ? selectedGoal.age.lifeExpectancy : 95,
      },
      preRate: selectedGoal?.preRate ? selectedGoal.preRate.toString() : "0",
      postRate: selectedGoal?.postRate ? selectedGoal.postRate.toString() : "0",
      inflation: selectedGoal?.inflation ? selectedGoal.inflation.toString() : "0",
      savings: selectedGoal?.savings ? selectedGoal.savings.toString() : "0",
      monthlyContribution: selectedGoal?.monthlyContribution ? selectedGoal.monthlyContribution.toString() : "0",
      budget: selectedGoal?.budget ? selectedGoal.budget.toString() : "0",
    },
    resolver: zodResolver(schema),
  });

  // Handle Change
  function handleChange(e:any){
    //console.log(e.target.name)
    //dispatch(editRetireGoal({name:e.target.name, id, title, value:e.target.value}))
    dispatch(editSelectedGoal({type:'retire',name:e.target.name, goal:selectedGoal, value:e.target.value}))
  }

  React.useEffect(() => {
    if (selectedGoal) {
      reset({
        age: {
          currentAge: selectedGoal?.age?.currentAge ? selectedGoal.age.currentAge : 23,
          retireAge: selectedGoal?.age?.retireAge ? selectedGoal.age.retireAge : 67,
          lifeExpectancy: selectedGoal?.age?.lifeExpectancy ? selectedGoal.age.lifeExpectancy : 95,
        },
        preRate: selectedGoal?.preRate ? selectedGoal.preRate.toString() : "0",
        postRate: selectedGoal?.postRate ? selectedGoal.postRate.toString() : "0",
        inflation: selectedGoal?.inflation ? selectedGoal.inflation.toString() : "0",
        savings: selectedGoal?.savings ? selectedGoal.savings.toString() : "0",
        monthlyContribution: selectedGoal?.monthlyContribution ? selectedGoal.monthlyContribution.toString() : "0",
        budget: selectedGoal?.budget ? selectedGoal.budget.toString() : "0",
      });
    }
    trigger()
  }, [selectedGoal,reset]);

  React.useEffect(()=>{

  })

  console.log(errors)


  return (
    <div className="w-full h-full py-4 px-3 flex flex-col bg-[#EADDCA] dark:bg-[#1814149c]">
      {/* Content */}
      <div className="w-full flex flex-col">
        <form className="w-full h-auto flex flex-col">
          {/* Current Age */}
          <div className="w-auto flex flex-col mb-3">
            <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
              Current Age
            </label>
            <input
              type="number"
              {...register("age.currentAge", {
                valueAsNumber: true,
                onChange: (e) => handleChange(e),
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
              name="savings"
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <NumericFormat
                  className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors.savings && "border-2 border-red-500"}`}
                  prefix="$"
                  thousandSeparator=","
                  decimalSeparator="."
                  decimalScale={2}
                  autoComplete="off"
                  getInputRef={ref}
                  onValueChange={(values, e) => {
                    dispatch(editRetireGoal({name:'savings', title, id, value:values.floatValue}))
                    dispatch(editSelectedGoal({type:'retire',name:'savings', goal:selectedGoal, value:values.floatValue}))
                  }}
                  {...rest}
                />
              )}
            />
            {errors?.savings && <p className="text-red-500 text-[13px] ">{errors?.savings?.message}</p>}
          </div>

          {/* Monthly Contribution */}
          <div className="w-auto flex flex-col mb-3">
            <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
              Monthly Contribution
            </label>
            <Controller
              name="monthlyContribution"
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <NumericFormat
                  className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors.monthlyContribution && "border-2 border-red-500"}`}
                  prefix="$"
                  thousandSeparator=","
                  decimalSeparator="."
                  decimalScale={2}
                  autoComplete="off"
                  getInputRef={ref}
                  {...rest}
                />
              )}
            />
            {errors?.monthlyContribution && <p className="text-red-500 text-[13px] ">{errors?.monthlyContribution?.message}</p>}
          </div>

          {/* Monthly budget in retirement */}
          <div className="w-auto flex flex-col mb-3">
            <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
              Monthly budget in retirement
            </label>
            <Controller
              name="budget"
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <NumericFormat
                  className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors.monthlyContribution && "border-2 border-red-500"}`}
                  prefix="$"
                  thousandSeparator=","
                  decimalSeparator="."
                  decimalScale={2}
                  autoComplete="off"
                  getInputRef={ref}
                  {...rest}
                />
              )}
            />
            {errors?.monthlyContribution && <p className="text-red-500 text-[13px] ">{errors?.monthlyContribution?.message}</p>}
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
                  name="preRate"
                  control={control}
                  render={({ field: { ref, ...rest } }) => (
                    <NumericFormat
                      className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors?.preRate && "border-2 border-red-500"}`}
                      suffix="%"
                      thousandSeparator=","
                      decimalSeparator="."
                      decimalScale={2}
                      autoComplete="off"
                      getInputRef={ref}
                      {...rest}
                    />
                  )}
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
                  name="postRate"
                  control={control}
                  render={({ field: { ref, ...rest } }) => (
                    <NumericFormat
                      className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors?.postRate && "border-2 border-red-500"}`}
                      suffix="%"
                      thousandSeparator=","
                      decimalSeparator="."
                      decimalScale={2}
                      autoComplete="off"
                      getInputRef={ref}
                      {...rest}
                    />
                  )}
                />
                {errors?.postRate && <p className="text-red-500 text-[13px] ">{errors?.postRate?.message}</p>}
              </div>

              {/* Inflation Rate */}
              <div className="w-auto flex flex-col mb-3">
                <label htmlFor="Current Age" className="text-[12px] dark:text-gray-300 text-black">
                  Inflation Rate
                </label>
                <Controller
                  name="inflation"
                  control={control}
                  render={({ field: { ref, ...rest } }) => (
                    <NumericFormat
                      className={`outline-none border border-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px] ${errors?.inflation && "border-2 border-red-500"}`}
                      suffix="%"
                      thousandSeparator=","
                      decimalSeparator="."
                      decimalScale={2}
                      autoComplete="off"
                      getInputRef={ref}
                      {...rest}
                    />
                  )}
                />
                {errors?.inflation && <p className="text-red-500 text-[13px] ">{errors?.inflation?.message}</p>}
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
}
