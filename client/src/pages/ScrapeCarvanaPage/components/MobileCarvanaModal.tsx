import { Modal } from "@mui/material";
import * as React from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ClearIcon from "@mui/icons-material/Clear";
import useFormHook from "../hooks/useFormHook";
import { FilterDataObj, clearFilters, setCurrentPage, setFilterStates } from "../../../redux/features/carStateSlice";
import CarvanaInputCard from "../CarvanaPageInputs/CarvanaInputCard";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Controller, SubmitHandler } from "react-hook-form";
import { FormFields } from "../hooks/useFormHook";
import { Checkbox, Typography, FormControlLabel, useMediaQuery } from "@mui/material";
import { Dispatch, UseSelector } from "../../../redux/store";
import { FilterIsSameCheck } from "../utils/FilterIsSameCheck";
import { updateSearch } from "../utils/updateSearch";
import { filterData } from "../../../redux/features/carSlice";
import { clearReduxState } from "../utils/clearObjects";
import { helpFormatCarNameClient } from "../utils/helpFormatCarNameClient";

export interface IMobileCarvanaModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  filterStates: FilterDataObj;
  getNumberOfFiltersForBagde(obj: FilterDataObj): number;
}

export default function MobileCarvanaModal({ setOpenModal, openModal, handleClose, handleOpen, filterStates, getNumberOfFiltersForBagde }: IMobileCarvanaModalProps) {
  // Redux States
  const { loading, carVana } = UseSelector((state) => state.car);
  const { currentPage } = UseSelector((state) => state.page);
  const { lightAndDarkMode } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  // Meida Query
  const lgBreakPoint = useMediaQuery("(min-width:1024px)");

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
    setOpenModal(false);
    window.scrollTo(0, 0);
  };

  React.useEffect(() => {
    if (openModal) {
      if (lgBreakPoint) {
        setOpenModal(false);
      }
    }
  }, [lgBreakPoint, openModal]); // eslint-disable-line

  return (
    <Modal onClose={handleClose} open={openModal}>
      <div className={`w-full h-full flex flex-col overflow-y-scroll ${lightAndDarkMode ? " bg-homeBg" : " bg-lightHomeBg"} dark:text-darkText text-lightText  `}>
        {/* Content */}
        <div className="w-full h-full flex flex-col p-2 relative  ">
          {/* Title */}
          <div className="w-full flex items-center justify-between border-b border-gray-300 py-4 px-4">
            <h1 className="text-[25px] font-medium">Filters</h1>
            <ClearIcon className="text-[25px]" onClick={() => setOpenModal(false)} />
          </div>

          {/* All Filters */}
          <div className="w-full h-auto flex flex-col ">
            {/* Price */}
            <div className="w-full h-auto flex flex-col border-b border-gray-300">
              <div className=" flex justify-between items-center py-3 px-4 h-auto ">
                <h1 className="text-[19px] font-medium">Price</h1>

                {priceArrow ? <KeyboardArrowDownIcon onClick={() => setPriceArrow((val) => !val)} /> : <KeyboardArrowUpIcon onClick={() => setPriceArrow((val) => !val)} />}
              </div>

              {/* Price Box */}
              {priceArrow && (
                <div className=" flex flex-col w-full py-3 h-auto px-4">
                  <p>Price Range</p>
                  <div className={`w-full flex  justify-center ${errors.lowPrice || errors.highPrice ? "" : "items-center"}`}>
                    <CarvanaInputCard breakPoint="Mobile" errors={errors} control={control} name="lowPrice" label="Low Price" placeholder="" type="Number" />
                    {errors.lowPrice || errors.highPrice ? <span className={`mx-2 `}></span> : <span className={`mx-2 `}>-</span>}
                    <CarvanaInputCard breakPoint="Mobile" errors={errors} control={control} name="highPrice" label="High Price" placeholder="" type="Number" />
                  </div>
                </div>
              )}
            </div>
            {/* Make and Modal */}
            <div className="w-full h-auto flex flex-col border-b border-gray-300">
              <div className=" flex justify-between items-center py-4 px-4 h-auto ">
                <h1 className="text-[19px] font-medium">Make and Modal</h1>
                {makeAndModal ? <KeyboardArrowDownIcon onClick={() => setMakeAndModal((val) => !val)} /> : <KeyboardArrowUpIcon onClick={() => setMakeAndModal((val) => !val)} />}
              </div>

              {/* Modal Box */}
              {makeAndModal && (
                <div className=" flex flex-col w-full py-3 md:max-h-[400px] max-h-[250px] overflow-y-auto px-4">
                  {arrayForForms.map((item: string) => (
                    <Controller
                      key={item}
                      name={`${item as keyof FormFields}`}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <FormControlLabel
                          key={item}
                          control={
                            <Checkbox
                              sx={{
                                color: `${lightAndDarkMode && "#d1d5db"}`,
                                "&.Mui-checked": {
                                  color: "#00A36C",
                                },
                              }}
                            />
                          }
                          checked={value as boolean}
                          label={<Typography>{helpFormatCarNameClient(item)}</Typography>}
                          name={`${item}`}
                          onChange={onChange}
                        />
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
                {mileageArrow ? <KeyboardArrowDownIcon onClick={() => setMileageArrow((val) => !val)} /> : <KeyboardArrowUpIcon onClick={() => setMileageArrow((val) => !val)} />}
              </div>

              {/* Mileage Box */}
              {mileageArrow && (
                <div className=" flex flex-col w-full py-3 h-auto px-4">
                  <p>Mileage Range</p>
                  <div className={`w-full flex  justify-center ${errors.lowMileage || errors.highMileage ? "" : "items-center"}`}>
                    <CarvanaInputCard breakPoint="Desktop" errors={errors} control={control} name="lowMileage" label="Low Mileage" placeholder="" type="None" />
                    {errors.lowMileage || errors.highMileage ? <span className={`mx-2 `}></span> : <span className={`mx-2 `}>-</span>}
                    <CarvanaInputCard breakPoint="Desktop" errors={errors} control={control} name="highMileage" label="High Mileage" placeholder="" type="None" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}

          {/* Clear All */}
          {getNumberOfFiltersForBagde(filterStates) > 0 && (
            <button
              className="rounded-lg p-2 mt-4 bg-chartYellow text-black"
              onClick={() => {
                dispatch(clearFilters(clearReduxState));
              }}
            >
              Clear All
            </button>
          )}

          <button
            className={` rounded-lg p-2 my-4 ${
              errorsArray.length || !FilterIsSameCheck(allInputData, filterStates) || loading || !carVana ? "bg-gray-300 text-gray-400" : "bg-chartGreen text-white"
            } `}
            disabled={errorsArray.length > 0 || !FilterIsSameCheck(allInputData, filterStates) || loading || !carVana}
            onClick={handleSubmit(onSubmit)}
          >
            Search
          </button>
        </div>
      </div>
    </Modal>
  );
}
