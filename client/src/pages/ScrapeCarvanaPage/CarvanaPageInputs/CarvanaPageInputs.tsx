import * as React from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { z } from "zod";
import { Controller, SubmitHandler } from "react-hook-form";
import { carvanaSchema } from "./CarvanaInputSchema";
import CarvanaInputCard from "./CarvanaInputCard";
import { Dispatch, UseSelector } from "../../../redux/store";
import { Checkbox, Typography, FormControlLabel } from "@mui/material";
import { setCurrentPage, setFilterStates } from "../../../redux/features/carStateSlice";
import useFormHook from "../hooks/useFormHook";
import { FilterIsSameCheck } from "../utils/FilterIsSameCheck";
import { filterData } from "../../../redux/features/carSlice";
import { updateSearch } from "../utils/updateSearch";
import FilterBoxContainer from "./FilterBoxContainer";

type FormFields = z.infer<typeof carvanaSchema>;

export interface ICarvanaPageInputsProps {}

export default function CarvanaPageInputs(props: ICarvanaPageInputsProps) {
  const { filterStates, currentPage } = UseSelector((state) => state.page);
  const { loading, carVana } = UseSelector((state) => state.car);
  const dispatch = Dispatch();

  // Filter States Open and Close
  const [priceArrow, setPriceArrow] = React.useState(false);
  const [makeAndModal, setMakeAndModal] = React.useState(false);
  const [mileageArrow, setMileageArrow] = React.useState(false);

  // Custom Hook For React Hook Form
  const { control, watch, errors, handleSubmit } = useFormHook({ states: filterStates });

  const errorsArray = Object.keys(errors);

  const arrayForForms = Object.keys(filterStates.makeAndModalStates);

  const allInputData = watch();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const obj = updateSearch(data, currentPage);

    dispatch(filterData(obj.backendData));
    dispatch(setFilterStates(obj.reduxData));
    dispatch(setCurrentPage(1));
    setPriceArrow(false);
    setMakeAndModal(false);
    setMileageArrow(false);
    window.scrollTo(0, 0);
  };



  return (
    <div className="w-full h-auto flex flex-col dark:text-darkText text-lightText">
      {/* Filter Box Above Price.... Shows all selected filters */}
      <FilterBoxContainer state={filterStates} />

      {/* Make and Modal Boxes */}

      {/* Price */}
      <div className="w-full h-auto flex flex-col border-b border-gray-300">
        <div className=" flex justify-between items-center py-3 px-4 h-auto ">
          <h1 className="text-[19px] font-medium">Price</h1>

          <KeyboardArrowUpIcon onClick={() => setPriceArrow((val) => !val)} />
        </div>

        {/* Price Box */}
        {priceArrow && (
          <div className=" flex flex-col w-full py-3 h-auto px-4">
            <p>Price Range</p>
            <div className={`w-full flex  justify-center ${errors.lowPrice || errors.highPrice ? "" : "items-center"}`}>
              <CarvanaInputCard errors={errors} control={control} name="lowPrice" label="Low Price" placeholder="" type="Number" />
              {errors.lowPrice || errors.highPrice ? <span className={`mx-2 `}></span> : <span className={`mx-2 `}>-</span>}
              <CarvanaInputCard errors={errors} control={control} name="highPrice" label="High Price" placeholder="" type="Number" />
            </div>
          </div>
        )}
      </div>

      {/* Make and Modal */}
      <div className="w-full h-auto flex flex-col border-b border-gray-300">
        <div className=" flex justify-between items-center py-4 px-4 h-auto ">
          <h1 className="text-[19px] font-medium">Make and Modal</h1>
          <KeyboardArrowUpIcon onClick={() => setMakeAndModal((val) => !val)} />
        </div>

        {/* Modal Box */}
        {makeAndModal && (
          <div className=" flex flex-col w-full py-3 h-auto px-4">
            {arrayForForms.map((item: string) => (
              <Controller
                key={item}
                name={`${item as keyof FormFields}`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel key={item} control={<Checkbox />} checked={value as boolean} label={<Typography>{item}</Typography>} name={`${item}`} onChange={onChange} />
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mileage */}
      <div className="w-full h-auto flex flex-col border-b border-gray-300">
        <div className=" flex justify-between items-center py-4 px-4 h-auto ">
          <h1 className="text-[19px] font-medium">Milegae</h1>
          <KeyboardArrowUpIcon onClick={() => setMileageArrow((val) => !val)} />
        </div>

        {/* Mileage Box */}
        {mileageArrow && (
          <div className=" flex flex-col w-full py-3 h-auto px-4">
            <p>Mileage Range</p>
            <div className={`w-full flex  justify-center ${errors.lowMileage || errors.highMileage ? "" : "items-center"}`}>
              <CarvanaInputCard errors={errors} control={control} name="lowMileage" label="Low Mileage" placeholder="" type="None" />
              {errors.lowMileage || errors.highMileage ? <span className={`mx-2 `}></span> : <span className={`mx-2 `}>-</span>}
              <CarvanaInputCard errors={errors} control={control} name="highMileage" label="High Mileage" placeholder="" type="None" />
            </div>
          </div>
        )}
      </div>

      {/* Update Button */}

      <button
        className={` rounded-lg p-2 my-4 ${errorsArray.length || !FilterIsSameCheck(allInputData, filterStates) || loading || !carVana ? "bg-gray-300 text-gray-400" : "bg-chartGreen text-white"} `}
        disabled={errorsArray.length > 0 || !FilterIsSameCheck(allInputData, filterStates) || loading || !carVana}
        onClick={handleSubmit(onSubmit)}
      >
        Search
      </button>
    </div>
  );
}
