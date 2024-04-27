import * as React from "react";
import { house1stSchema } from "../../components/multiStepDivs/houseDivs/houseComponents/house1stSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dispatch } from "../../redux/store";
import HouseControllerInput from "../../components/multiStepDivs/houseDivs/houseComponents/HouseControllerInput";
import { HouseObjWithFormattedData, editHouseGoal, houseShowInput } from "../../redux/features/modalSlices/houseSlice";
import { MenuItem, Select, SelectChangeEvent, useMediaQuery } from "@mui/material";
import { houseTerms } from "../../components/multiStepDivs/houseDivs/houseComponents/House1stInputs";
import { editSelectedGoal, selectedShowInput } from "../../redux/features/applicationSlice";
import { isTheSameCheck } from "./components/utils/isTheSameCheck";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export interface IHousePageInputsProps {
  selectedGoal: HouseObjWithFormattedData;
}
type FormFields = z.infer<typeof house1stSchema>;

export default function HousePageInputs({ selectedGoal }: IHousePageInputsProps) {
  // Redux States
  const dispatch = Dispatch();
  const { showInputs } = selectedGoal;

  // Show mortgage insurance
  const [showMIP, setShowMIP] = React.useState(false);

  // Show Inputs on mobile states
  const matches = useMediaQuery("(min-width:1024px)");

  // Form Feilds
  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormFields>({
    mode: "all",
    resetOptions: {
      keepErrors: true, // input errors will be retained with value update
    },
    //the average annual cost of homeowners insurance in the U.S. is $2,511.25 ... / 12 === 209
    defaultValues: React.useMemo(() => {
      return {
        price: selectedGoal.price.toString(),
        downPayment: selectedGoal.downPayment.toString(),
        interest: selectedGoal.interest.toString(),
        term: selectedGoal.term,
        streetAddress: selectedGoal.streetAddress,
        img: selectedGoal.img,
        id: selectedGoal.id,
        extraPayment: selectedGoal.extraPayment.toString(),
        propertyTax: selectedGoal.propertyTax.toString(),
        insurance: selectedGoal.insurance.toString(),
        mortgageInsurance: selectedGoal.downPayment < selectedGoal.price * 0.2 ? selectedGoal.mortgageInsurance.toString() : "0",
        appreciation: selectedGoal.appreciation.toString(),
        maintenance: selectedGoal.maintenance.toString(),
        opportunityCostRate: selectedGoal.opportunityCostRate.toString(),
      };
    }, [selectedGoal]),
    resolver: zodResolver(house1stSchema),
  });

  const allInputData = watch();
  const twentyPercentValue = Number(parseFloat(allInputData.price) * 0.2);
  const downPayment = watch("downPayment");

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const { id, streetAddress, price, downPayment, interest, term, extraPayment, img, propertyTax, insurance, mortgageInsurance, appreciation, opportunityCostRate, maintenance } = data;

    const newObj: HouseObjWithFormattedData = {
      id,
      streetAddress,
      price: parseFloat(price.replace(/[,%$]/gm, "")),
      downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
      interest: parseFloat(interest.replace(/[,%$]/gm, "")),
      term,
      extraPayment: parseFloat(extraPayment.replace(/[,%$]/gm, "")),
      img: img ? img : "",
      propertyTax: parseFloat(propertyTax.replace(/[,%$]/gm, "")),
      insurance: parseFloat(insurance.replace(/[,%$]/gm, "")),
      mortgageInsurance: parseFloat(mortgageInsurance.replace(/[,%$]/gm, "")),
      appreciation: parseFloat(appreciation.replace(/[,%$]/gm, "")),
      opportunityCostRate: parseFloat(opportunityCostRate.replace(/[,%$]/gm, "")),
      maintenance: parseFloat(maintenance.replace(/[,%$]/gm, "")),
      type: "House",
      showTax: selectedGoal.showTax,
      showInputs,
    };

    dispatch(editSelectedGoal({ goal: newObj }));
    dispatch(editHouseGoal({ goal: newObj, id }));
  };

  function SubmitValidation(e: any) {
    e.preventDefault();
    if (!downPayment || !twentyPercentValue || !allInputData.mortgageInsurance) return;

    // If the down payment is less than 20%
    if (parseFloat(downPayment) < twentyPercentValue) {
      // if the mortgage insurance is less than or equal to 0 ... and a user clicks we show and error ... else we continue
      if (parseFloat(allInputData.mortgageInsurance) <= 0) {
        setError("mortgageInsurance", { type: "custom", message: "Please enter a value greater than 0%" });
      } else {
        handleSubmit(onSubmit)();
      }
    } else {
      // if the down payment is not less than 20% ... then we dont have mortgage insurance
      clearErrors("mortgageInsurance");
      setValue("mortgageInsurance", "0");
      handleSubmit(onSubmit)();
    }
  }

  // Handle Change
  const handleChange = (event: SelectChangeEvent) => {
    setValue("term", Number(event.target.value) as number);
  };

  const errorsArray = Object.keys(errors);
  // Using loadash to compare object ... if the selected goal doesnt match the currnet inputs on the page ... we show an update button

  // Checking if the down payment is less than or greater than 20% ... so we can show mortgage insurance .. ON RENDER HERE
  React.useEffect(() => {
    const twentyPercentValue = Number(selectedGoal.price * 0.2);

    if (selectedGoal.downPayment < twentyPercentValue) {
      setShowMIP(true);
    } else {
      setShowMIP(false);
    }
  }, [selectedGoal]);

  // Checking if the down payment is less than or greater than 20% ... so we can show mortgage insurance .. ON USER INPUT/TYPE
  React.useEffect(() => {
    const subscription = watch((value) => {
      const twentyPercentValue = Number(parseFloat(value.price as string) * 0.2);

      if (parseFloat(value.downPayment as string) < twentyPercentValue) {
        setShowMIP(true);
      } else {
        setShowMIP(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, selectedGoal]);

  // Makes Sure inputs match selected goal on page refresh
  React.useEffect(() => {
    reset({
      price: selectedGoal.price.toString(),
      downPayment: selectedGoal.downPayment.toString(),
      interest: selectedGoal.interest.toString(),
      term: selectedGoal.term,
      streetAddress: selectedGoal.streetAddress,
      img: selectedGoal.img,
      id: selectedGoal.id,
      extraPayment: selectedGoal.extraPayment.toString(),
      propertyTax: selectedGoal.propertyTax.toString(),
      insurance: selectedGoal.insurance.toString(),
      mortgageInsurance: selectedGoal.downPayment < selectedGoal.price * 0.2 ? selectedGoal.mortgageInsurance.toString() : "0",
      appreciation: selectedGoal.appreciation.toString(),
      maintenance: selectedGoal.maintenance.toString(),
      opportunityCostRate: selectedGoal.opportunityCostRate.toString(),
    });
  }, [selectedGoal, isSubmitSuccessful]); // eslint-disable-line

  React.useEffect(() => {
    if (showInputs === false) {
      if (matches) {
        dispatch(selectedShowInput({ goal: selectedGoal, value: true }));
        dispatch(houseShowInput({ id: selectedGoal.id, value: true }));
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
                dispatch(houseShowInput({ id: selectedGoal.id, value: false }));
              }}
            />
          ) : (
            <KeyboardArrowDownIcon
              className="text-[28px] cursor-pointer"
              onClick={() => {
                dispatch(selectedShowInput({ goal: selectedGoal, value: true }));
                dispatch(houseShowInput({ id: selectedGoal.id, value: true }));
              }}
            />
          )}
        </div>
        
        {showInputs ? (
          <form className="w-full h-auto flex flex-col " onSubmit={(e) => SubmitValidation(e)}>
            {/* Price */}
            <HouseControllerInput errors={errors} control={control} name="price" label="Price" placeholder="" type="Number" />

            {/* Down Payment*/}
            <HouseControllerInput errors={errors} control={control} name="downPayment" label="Down Payment" placeholder="" type="Number" />

            {/* Extra Monthly Payment */}
            <HouseControllerInput errors={errors} control={control} name="extraPayment" label="Extra Monthly Payment" placeholder="" type="Number" />

            {/* Interest */}
            <HouseControllerInput errors={errors} control={control} name="interest" label="Interest" placeholder="" type="Percent" />

            {/* Loan Term */}
            <div className="w-auto flex flex-col mb-2">
              <label htmlFor="term" className="text-[12px]">
                Loan Term (Years)
              </label>
              <Select
                label="Loan Term"
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
                className={`outline-none border border-black h-[38px]  dark:border-none  mt-1 bg-white placeholder:text-[15px] ${errors.term && "border-2 border-red-500"}`}
                onChange={handleChange}
                value={allInputData.term.toString()}
              >
                {houseTerms.map((item: string) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Property Tax */}
            <HouseControllerInput errors={errors} control={control} name="propertyTax" label="Property Tax" placeholder="" type="Percent" />

            {/* Insurance */}
            <HouseControllerInput errors={errors} control={control} name="insurance" label="Insurance" placeholder="" type="Number" />

            {/* MIP */}
            <AnimatePresence>
              {showMIP && (
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1, transition: { duration: 0.2, ease: easeInOut } }}
                  exit={{ opacity: [0.8, 0.5, 0], transition: { duration: 0.2, ease: easeInOut } }}
                >
                  <HouseControllerInput errors={errors} control={control} name="mortgageInsurance" label="Mortgage Insurance" placeholder="" type="Percent" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Update Button */}
            <AnimatePresence>
              {selectedGoal && isTheSameCheck(selectedGoal, allInputData) && (
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1, transition: { duration: 0.2, ease: easeInOut } }}
                  exit={{ opacity: [0.8, 0.5, 0], transition: { duration: 0.2, ease: easeInOut } }}
                  className="w-full flex flex-col"
                >
                  <button className={` rounded-lg p-1 ${errorsArray.length ? "bg-gray-300 text-gray-400" : "bg-chartGreen text-white"} `}>Update</button>
                  {Number(parseFloat(allInputData.downPayment)) > Number(parseFloat(allInputData.price)) * 0.2 && (
                    <p className="text-[12px] dark:text-chartGreen text-green-900 mt-2">
                      If you had mortgage insurance it will now be removed since your down payment is greater than 20%. Click the update button to save your results.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        ) : (
          <div className="flex items-end justify-end w-full h-auto">
            <p
              className="text-[12.5px] underline cursor-pointer"
              onClick={() => {
                dispatch(selectedShowInput({ goal: selectedGoal, value: true }));
                dispatch(houseShowInput({ id: selectedGoal.id, value: true }));
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
