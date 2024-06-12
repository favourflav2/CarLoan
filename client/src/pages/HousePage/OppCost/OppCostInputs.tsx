import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { opportunityCostSchema } from "./OpportunityCostSchema";
import { HouseObjWithFormattedData, editHouseGoal, houseShowOppCostInput } from "../../../redux/features/modalSlices/houseSlice";
import OppCostInputCard from "./OppCostInputCard";
import { USDollar } from "../../CarPage/CarPage";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Tooltip, useMediaQuery } from "@mui/material";
import { isTheSameCheckOppCost } from "../components/utils/isTheSameCheck";
import { getBreakEvenNumber } from "../components/utils/getBreakEvenNumber";
import { Dispatch } from "../../../redux/store";
import { editSelectedGoal, selectedShowOppCostInput } from "../../../redux/features/applicationSlice";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export interface IOppCostInputsProps {
  selectedGoal: HouseObjWithFormattedData;
}
type FormFields = z.infer<typeof opportunityCostSchema>;

export default function OppCostInputs({ selectedGoal }: IOppCostInputsProps) {
  // Redux States
  const dispatch = Dispatch();

  // Show Inputs on mobile states
  const matches = useMediaQuery("(min-width:1280px)");

  const { interest, maintenance, propertyTax, opportunityCostRate, rent, appreciation, price, downPayment, showOppCostInputs } = selectedGoal;
  // Form Feilds
  const {
    control,
    reset,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormFields>({
    mode: "all",
    resetOptions: {
      keepErrors: true, // input errors will be retained with value update
    },
    defaultValues: React.useMemo(() => {
      return {
        interest: interest.toString(),
        rent: rent.toString(),
        propertyTax: propertyTax.toString(),
        appreciation: appreciation.toString(),
        maintenance: maintenance.toString(),
        opportunityCostRate: opportunityCostRate.toString(),
      };
    }, [interest, maintenance, propertyTax, opportunityCostRate, rent, appreciation]),
    resolver: zodResolver(opportunityCostSchema),
  });
  const allInputData = watch();

  const housePrice = USDollar.format(Number(price.toFixed(2)));
  const houseDownPayment = USDollar.format(Number(downPayment.toFixed(2)));

  const errorsArray = Object.keys(errors);

  // Break Even Point Per Month
  const breakEvenPerMonth = getBreakEvenNumber(selectedGoal).resultNoFormat;

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const { interest: interestData, propertyTax: propertyTaxData, appreciation: appreciationData, opportunityCostRate: opportunityCostRateData, maintenance: maintenanceData, rent: rentData } = data;

    const newObj: HouseObjWithFormattedData = {
      id: selectedGoal.id,
      streetAddress: selectedGoal.streetAddress,
      price: selectedGoal.price,
      downPayment: selectedGoal.downPayment,
      interest: parseFloat(interestData.replace(/[,%$]/gm, "")),
      term: selectedGoal.term,
      extraPayment: selectedGoal.extraPayment,
      img: selectedGoal.img ? selectedGoal.img : "",
      propertyTax: parseFloat(propertyTaxData.replace(/[,%$]/gm, "")),
      insurance: selectedGoal.insurance,
      mortgageInsurance: selectedGoal.mortgageInsurance,
      appreciation: parseFloat(appreciationData.replace(/[,%$]/gm, "")),
      opportunityCostRate: parseFloat(opportunityCostRateData.replace(/[,%$]/gm, "")),
      maintenance: parseFloat(maintenanceData.replace(/[,%$]/gm, "")),
      rent: parseFloat(rentData.replace(/[,%$]/gm, "")),
      type: "House",
      showTax: selectedGoal.showTax,
      showInputs: selectedGoal.showInputs,
      showOppCostInputs: selectedGoal.showOppCostInputs,
      creator:null,
      date:null
    };

    dispatch(editSelectedGoal({ goal: newObj }));
    dispatch(editHouseGoal({ goal: newObj, id: selectedGoal.id }));
  };

  function SubmitValidation(e: any) {
    e.preventDefault();
    if (!allInputData.rent || !breakEvenPerMonth) return;

    // if the newly typed rent value is less than the break even per month we show an error
    if (parseFloat(allInputData.rent) >= breakEvenPerMonth) {
      setError("rent", {
        type: "custom",
        message:
          "If the rent is greater than or equal to the break even per month, it would make sense to just buy. However, in order for us to compare the rent to the total cost of homeownership we need the rent to be less than the break even per month.",
      });
      console.log(allInputData.rent, "sss", breakEvenPerMonth);
    } else {
      // if the newly typed rent value is less than the break even per month we clear the error and submit
      clearErrors("rent");
      handleSubmit(onSubmit)();
    }
  }

  // Makes Sure inputs match selected goal on page refresh
  React.useEffect(() => {
    reset({
      interest: selectedGoal.interest.toString(),
      propertyTax: selectedGoal.propertyTax.toString(),
      appreciation: selectedGoal.appreciation.toString(),
      maintenance: selectedGoal.maintenance.toString(),
      opportunityCostRate: selectedGoal.opportunityCostRate.toString(),
      rent: selectedGoal.rent.toString(),
    });
  }, [selectedGoal, isSubmitSuccessful]); // eslint-disable-line

  React.useEffect(() => {
    if (showOppCostInputs === false) {
      if (matches) {
        dispatch(selectedShowOppCostInput({ goal: selectedGoal, value: true }));
        dispatch(houseShowOppCostInput({ id: selectedGoal.id, value: true }));
      }
    }
  }, [matches, showOppCostInputs, selectedGoal]); // eslint-disable-line

  return (
    <div className="w-full h-auto flex flex-col">
      {/* Content */}
      <div className="w-full h-full flex flex-col">
        {/* Expand and Shrink Input Section Btn */}
        <div className="flex items-end justify-end w-full h-auto xl:hidden">
          {showOppCostInputs ? (
            <KeyboardArrowUpIcon
              className="text-[28px] cursor-pointer"
              onClick={() => {
                dispatch(selectedShowOppCostInput({ goal: selectedGoal, value: false }));
                dispatch(houseShowOppCostInput({ id: selectedGoal.id, value: false }));
              }}
            />
          ) : (
            <KeyboardArrowDownIcon
              className="text-[28px] cursor-pointer"
              onClick={() => {
                dispatch(selectedShowOppCostInput({ goal: selectedGoal, value: true }));
                dispatch(houseShowOppCostInput({ id: selectedGoal.id, value: true }));
              }}
            />
          )}
        </div>

        {showOppCostInputs ? (
          <form className="w-full flex flex-col h-full" onSubmit={(e) => SubmitValidation(e)}>
            {/* House Price */}
            <div className="w-full  flex flex-col mb-3">
              <label htmlFor="price" className="text-[12px] dark:text-gray-300 text-black">
                House Price
              </label>

              <input type="text" className="outline-none border border-black text-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px]" readOnly value={housePrice} />
            </div>

            {/* Down Payment */}
            <div className="w-full  flex flex-col mb-3">
              <label htmlFor="price" className="text-[12px] dark:text-gray-300 text-black">
                Down Payment
              </label>

              <input type="text" className="outline-none border border-black text-black  dark:border-none p-[6px] mt-1 bg-white placeholder:text-[15px]" readOnly value={houseDownPayment} />
            </div>

            {/* Maintenance */}
            <OppCostInputCard
              errors={errors}
              control={control}
              name="maintenance"
              label="Maintenance"
              placeholder=""
              type="Percent"
              tooltip="A common suggestion is to allocate approximately 1% of the property's value per year, on average, to cover maintenance costs"
            />

            {/* Property Tax */}
            <OppCostInputCard
              errors={errors}
              control={control}
              name="propertyTax"
              label="Property Tax"
              placeholder=""
              type="Percent"
              tooltip="Typically, property taxes amount to around 1% of the home's value"
            />

            {/* Interest */}
            <OppCostInputCard errors={errors} control={control} name="interest" label="Mortgage Interest Rate" placeholder="" type="Percent" tooltip="Mortgage Interest Rate" />

            {/* Rent */}
            <OppCostInputCard
              errors={errors}
              control={control}
              name="rent"
              label="Rent"
              placeholder=""
              type="Number"
              tooltip="The average rent in the United States is $1,515/month. However, you can enter a rent amount you want to compare to the total non-recoverable costs of homeownership"
            />

            {/* Appreciation */}
            <OppCostInputCard
              errors={errors}
              control={control}
              name="appreciation"
              label="Expected Home Appreciation"
              placeholder=""
              type="Percent"
              tooltip="Historically speaking, homes in the U.S. generally only appreciate by 2–3% per year on average. Futhermore, this will help get a better estimate on the future value of your home. And help provide a more accurate break even point per month."
            />

            {/* Stock/Bond/Investment Expected Return */}
            <OppCostInputCard
              errors={errors}
              control={control}
              name="opportunityCostRate"
              label="Stock/Bond/Investment Expected Return"
              placeholder=""
              type="Percent"
              tooltip="TThe average yearly return of the S&P 500 is 7.4% adjusted for inflation over the last 100 years. This expected return is very important, this rate here is what allows people, influencers, etc… To ask the question, is buying a home really a good investment?"
            />

            {/* Opp Cost % */}
            <div className="w-full h-auto flex flex-col items-center justify-center mt-2">
              {/* 5% Rule Number */}
              <div className="w-auto flex mb-1">
                <h1 className="text-[14.5px] sm:text-[16px]">
                  Simple Rule: <span className="font-bold">{getBreakEvenNumber(selectedGoal).rulePercentFormatted}%</span>
                </h1>
                <Tooltip title="Property Tax + Maintenance Cost + Cost of Capital" placement="top-end">
                  <HelpOutlineIcon className="text-[12.5px] ml-[2px]" />
                </Tooltip>
              </div>

              {/* Break Even Point Per Month */}
              <div className="w-auto flex">
                <h1 className="text-[14.5px] sm:text-[16px]">
                  Break Even Point Per Month: <span className="font-bold">{getBreakEvenNumber(selectedGoal).resultFormatted}</span>
                </h1>
                <Tooltip title="If rent is cheaper than this number, the math then favors renting" placement="top-end">
                  <HelpOutlineIcon className="text-[12.5px] ml-[2px]" />
                </Tooltip>
              </div>
            </div>

            <p className="text-[12px] sm:hidden block mt-1">~ If rent is cheaper than this number, the math then favors renting</p>

            {/* Update Button */}
            <AnimatePresence>
              {selectedGoal && isTheSameCheckOppCost(selectedGoal, allInputData) && (
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1, transition: { duration: 0.2, ease: easeInOut } }}
                  exit={{ opacity: [0.8, 0.5, 0], transition: { duration: 0.2, ease: easeInOut } }}
                  className="w-full flex flex-col"
                >
                  <button className={` rounded-lg p-1 ${errorsArray.length ? "bg-gray-300 text-gray-400" : "bg-chartGreen text-white"} my-3`}>Update</button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        ) : (
          <div className="flex items-end justify-end w-full h-auto">
            <p
              className="text-[12.5px] underline cursor-pointer"
              onClick={() => {
                dispatch(selectedShowOppCostInput({ goal: selectedGoal, value: true }));
                dispatch(houseShowOppCostInput({ id: selectedGoal.id, value: true }));
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
