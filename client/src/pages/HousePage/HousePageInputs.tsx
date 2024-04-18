import * as React from "react";
import { house1stSchema } from "../../components/multiStepDivs/houseDivs/houseComponents/house1stSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import _ from "lodash";
import { useForm, SubmitHandler } from "react-hook-form";
import { UseSelector } from "../../redux/store";
import HouseControllerInput from "../../components/multiStepDivs/houseDivs/houseComponents/HouseControllerInput";
import {  HouseObjWithFormattedData } from "../../redux/features/modalSlices/houseSlice";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { houseTerms } from "../../components/multiStepDivs/houseDivs/houseComponents/House1stInputs";

export interface IHousePageInputsProps {}
type FormFields = z.infer<typeof house1stSchema>;

export default function HousePageInputs(props: IHousePageInputsProps) {
  // Redux States
  const { selectedGoal } = UseSelector((state) => state.app);

  // Show Update Btn
  const [showUpadateBtn, setShowUpdateBtn] = React.useState<boolean>(false);

  // Show mortgage insurance
  const [showMIP, setShowMIP] = React.useState(false);

  // Form Feilds
  const {
    control,
    //reset,
    handleSubmit,
    watch,
    //trigger,
    setValue,
    formState: { errors },
  } = useForm<FormFields>({
    mode: "all",
    resetOptions: {
      keepErrors: true, // input errors will be retained with value update
    },
    //the average annual cost of homeowners insurance in the U.S. is $2,511.25 ... / 12 === 209
    defaultValues: {
      price: selectedGoal?.type === "House" && selectedGoal?.price ? selectedGoal.price.toString() : "0",
      downPayment: selectedGoal?.type === "House" && selectedGoal?.downPayment ? selectedGoal.downPayment.toString() : "0",
      interest: selectedGoal?.type === "House" && selectedGoal?.interest ? selectedGoal.interest.toString() : "0",
      term: selectedGoal?.type === "House" && selectedGoal?.term ? selectedGoal.term : 30,
      streetAddress: selectedGoal?.type === "House" && selectedGoal?.streetAddress ? selectedGoal.streetAddress : "",
      img: selectedGoal?.type === "House" && selectedGoal?.img ? selectedGoal.img : "",
      id: selectedGoal?.type === "House" && selectedGoal?.id ? selectedGoal.id : "",
      extraPayment: selectedGoal?.type === "House" && selectedGoal?.extraPayment ? selectedGoal.extraPayment.toString() : "0",
      propertyTax: selectedGoal?.type === "House" && selectedGoal?.propertyTax ? selectedGoal.propertyTax.toString() : "1.11",
      insurance: selectedGoal?.type === "House" && selectedGoal?.insurance ? selectedGoal.insurance.toString() : "209.27",
      mortgageInsurance: selectedGoal?.type === "House" && selectedGoal?.mortgageInsurance ? selectedGoal.mortgageInsurance.toString() : "1",
      appreciation: selectedGoal?.type === "House" && selectedGoal?.appreciation ? selectedGoal.appreciation.toString() : "2",
      maintenance: selectedGoal?.type === "House" && selectedGoal?.maintenance ? selectedGoal.maintenance.toString() : "1",
      opportunityCostRate: selectedGoal?.type === "House" && selectedGoal?.opportunityCostRate ? selectedGoal.opportunityCostRate.toString() : "1",
    },
    resolver: zodResolver(house1stSchema),
  });

  const allInputData = watch();

  // Handle Change
  const handleChange = (event: SelectChangeEvent) => {
    setValue("term", Number(event.target.value) as number);
  };

  const errorsArray = Object.keys(errors);

  // Using loadash to compare object ... if the selected goal doesnt match the currnet inputs on the page ... we show an update button
  React.useEffect(() => {
    function checkValid(select: HouseObjWithFormattedData, inputStates: HouseObjWithFormattedData) {
      if (!select) return false;

      const { img, id, price, term, downPayment, interest, extraPayment, streetAddress, appreciation, propertyTax, maintenance, opportunityCostRate, mortgageInsurance, insurance } = inputStates;

      const obj: HouseObjWithFormattedData = {
        id,
        streetAddress,
        type: "House",
        price ,
        downPayment,
        interest,
        extraPayment,
        propertyTax,
        insurance,
        mortgageInsurance,
        appreciation,
        opportunityCostRate,
        maintenance,
        term,
        img: img ? img : "",
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
      if (!selectedGoal || selectedGoal?.type !== "House") return;
      if (!data) return;
      const { img, id, price, term, downPayment, interest, extraPayment, streetAddress, appreciation, propertyTax, maintenance, opportunityCostRate, mortgageInsurance, insurance } = data;
      const newData: HouseObjWithFormattedData = {
        price: price ? parseFloat(price.replace(/[,%$]/gm, "")) : 0,
        downPayment: downPayment ? parseFloat(downPayment.replace(/[,%$]/gm, "")) : 0,
        interest: interest ? parseFloat(interest.replace(/[,%$]/gm, "")) : 0,
        term: term ? term : 30,
        streetAddress: streetAddress ? streetAddress : "",
        img: img ? img : "",
        id: id ? id : "",
        extraPayment: extraPayment ? parseFloat(extraPayment.replace(/[,%$]/gm, "")) : 0,
        propertyTax: propertyTax ? parseFloat(propertyTax.replace(/[,%$]/gm, "")) : 1.11,
        insurance: insurance ? parseFloat(insurance.replace(/[,%$]/gm, "")) : 209.27,
        mortgageInsurance: mortgageInsurance ? parseFloat(mortgageInsurance.replace(/[,%$]/gm, "")) : 1,
        appreciation: appreciation ? parseFloat(appreciation.replace(/[,%$]/gm, "")) : 2,
        maintenance: maintenance ?parseFloat(maintenance.replace(/[,%$]/gm, "")) : 1,
        opportunityCostRate: opportunityCostRate ? parseFloat(opportunityCostRate.replace(/[,%$]/gm, "")) : 1,
        type:"House"
      };

      checkValid(selectedGoal, newData);
    });
    return () => subscription.unsubscribe();
  }, [watch, selectedGoal]);

  



  // Checking if the down payment is less than or greater than 20% ... so we can show mortgage insurance .. ON RENDER HERE
  React.useEffect(() => {
    if (!selectedGoal || selectedGoal?.type !== "House") return;
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
      const twentyPercentValue = Number(parseInt(value.price as string) * 0.2);

      if (parseInt(value.downPayment as string) < twentyPercentValue) {
        setShowMIP(true);
      } else {
        setShowMIP(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, selectedGoal]);

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);

    // if(parseInt(data.downPayment) > dataTwentyPercentValue){
    //     setValue("mortgageInsurance","0")
    //     data.mortgageInsurance = "0"
    //     dispatch(addHouseGoal(data))
    //     dispatch(setAnyTypeOfModal({ value: false, type: "House" }));
        
    //   }else{
    //     dispatch(addHouseGoal(data))
    //     dispatch(setAnyTypeOfModal({ value: false, type: "House" }));
    //   }
  };



  if (!selectedGoal || selectedGoal.type !== "House") return null;
  return (
    <div className="w-full h-full py-4 px-4 min-[900px]:px-3 flex flex-col bg-[#EADDCA] dark:bg-[#1814149c]">
      {/* Content */}
      <div className="w-full flex flex-col">
        <form className="w-full h-auto flex flex-col " onSubmit={handleSubmit(onSubmit)}>
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
