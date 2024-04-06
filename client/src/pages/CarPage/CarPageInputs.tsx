import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { carPageSchemaSlider } from "./carPageSchemaSlider";
import { CarObj, CarObjWithFormattedData, editCarGoal } from "../../redux/features/modalSlices/carModalSlice";
import CarPageInputCard from "./CarPageInputCard";
import { editSelectedGoal } from "../../redux/features/applicationSlice";
import { motion, AnimatePresence, easeInOut } from "framer-motion";


export interface ICarPageInputsProps {
  executeScroll: () => void;
}

export type IndexNames = "mileage" | "price" | "downPayment" | "interest" | "term" | "salary";

type FormFields = z.infer<typeof carPageSchemaSlider>;

export default function CarPageInputs({ executeScroll }: ICarPageInputsProps) {
  // Redux States
  const { selectedGoal } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  // Show Update Btn
  const [updateList, setUpdateList] = React.useState<Array<string>>([]);
  const showUpadateBtn = updateList.length > 0;

  // Form Feilds
  const {
    control,
    reset,
    setValue,
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
    },
    resolver: zodResolver(carPageSchemaSlider),
  });

  function resetInputs() {
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
      });
      executeScroll();
    }
  }

  const handleSliderChange = (event: any, newValue: number | number[], name: IndexNames) => {
    if (name !== "term") {
      setValue(name, newValue.toString());
    } else {
      setValue(name, newValue as number);
    }
  };

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const { img, id, price, mileage, term, name, modal, downPayment, interest, salary } = data;

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
    };

    dispatch(editSelectedGoal({ goal: newObj }));
    dispatch(editCarGoal({ id, goal: newObj }));

    executeScroll();
  };

  const allInputData = watch();

  //* This function pushes a string into an array ... any value a user changes that is not equal to the selected goal ... allows me to add styling to the slidebar
  function updateListFunction(select: CarObjWithFormattedData, obj: CarObjWithFormattedData) {
    // Loop over both objects
    for (let key in obj) {
      for (let selectedGoalKey in select) {
        // if the key in our input object mathces the key in the selected goal we continue
        if (key === selectedGoalKey) {
          //* if the value where the input obj matches the selected goal obj doesnt match ... this means the user has attempted to update a value
          // so we push what they updated to an array
          if (obj[key as keyof CarObjWithFormattedData] !== select[selectedGoalKey as keyof CarObjWithFormattedData]) {
            setUpdateList((item) => {
              const index = item.findIndex((value) => value === key);
              if (index === -1) {
                return [...item, key];
              } else {
                return [...item];
              }
            });
          } else {
            //* If theres no match or theres a refresh or a user set a value back to where it now matches the selected goal obj we remove the update from the array
            setUpdateList((item) => {
              const newArr = item.filter((val) => val !== key);
              return newArr;
            });
          }
        }
      }
    }
  }

  React.useEffect(() => {
    function checkValid(select: CarObjWithFormattedData, inputStates: CarObj | any) {
      if (!select) return false;

      const { img, id, price, mileage, term, name, modal, downPayment, interest, salary } = inputStates;

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
      };

      updateListFunction(select, obj);
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
      });
    }
  }, [selectedGoal, reset]);

  if (!selectedGoal || selectedGoal.type !== "Car") return null;
  return (
    <div className="w-full h-auto flex flex-col -z-0">
      {/* Title */}
      <div className="w-auto flex flex-col my-4">
        <h1 className="font-bold">Refine your results</h1>
        <p className="text-[15px] mt-1">Use the sliders to play with the numbers and find your ideal plan.</p>
      </div>

      {/* Form */}
      <form className="w-full h-auto flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        {/* Price */}
        <CarPageInputCard
          updateList={updateList}
          label="Price"
          indexName="price"
          min={1000}
          max={750000}
          allInputData={allInputData}
          handleSliderChange={(e: any) => handleSliderChange(e, e.target.value, "price")}
          errors={errors}
          control={control}
        />

        {/* Down Payment */}
        <CarPageInputCard
          updateList={updateList}
          label="Down Payment"
          indexName="downPayment"
          min={0}
          max={750000}
          allInputData={allInputData}
          handleSliderChange={(e: any) => handleSliderChange(e, e.target.value, "downPayment")}
          errors={errors}
          control={control}
        />

        {/* Interest */}
        <CarPageInputCard
          updateList={updateList}
          label="Interest"
          indexName="interest"
          min={0}
          max={40}
          allInputData={allInputData}
          handleSliderChange={(e: any) => handleSliderChange(e, e.target.value, "interest")}
          errors={errors}
          control={control}
        />

        {/* Term */}
        <CarPageInputCard
          updateList={updateList}
          label="Term"
          indexName="term"
          min={36}
          max={120}
          allInputData={allInputData}
          handleSliderChange={(e: any) => handleSliderChange(e, e.target.value, "term")}
          errors={errors}
          control={control}
        />

        {/* Salary */}
        <CarPageInputCard
          updateList={updateList}
          label="Salary"
          indexName="salary"
          min={0}
          max={1000000}
          allInputData={allInputData}
          handleSliderChange={(e: any) => handleSliderChange(e, e.target.value, "salary")}
          errors={errors}
          control={control}
        />

        <AnimatePresence>
          {showUpadateBtn && (
            <div className="w-auto flex flex-col mb-[100px]">
              <motion.button
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1, transition: { duration: 0.2, ease: easeInOut } }}
                exit={{ opacity: [0.8, 0.5, 0], transition: { duration: 0.2, ease: easeInOut } }}
                type="button"
                className="w-auto p-2 rounded-lg border-black bg-gray-200  dark:bg-gray-500/30 border dark:border-darkText my-4"
                onClick={resetInputs}
              >
                Reset
              </motion.button>
              <motion.button
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1, transition: { duration: 0.2, ease: easeInOut } }}
                exit={{ opacity: [0.8, 0.5, 0], transition: { duration: 0.2, ease: easeInOut } }}
                className="w-auto p-2 rounded-lg bg-chartGreen "
              >
                Update
              </motion.button>
            </div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
