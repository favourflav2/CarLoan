import * as React from "react";
import { FilterDataObj, clearFilters } from "../../../redux/features/carStateSlice";
import FilterBoxMakeAndModal from "../../../components/filterBox/FilterBoxMakeAndModal";
import FilterBoxPrice from "../../../components/filterBox/FilterBoxPrice";
import FilterBoxMileage from "../../../components/filterBox/FilterBoxMileage";
import { Dispatch } from "../../../redux/store";
import {  clearReduxState } from "../utils/clearObjects";

export interface IFilterBoxContainerProps {
  state: FilterDataObj;
}

export default function FilterBoxContainer({ state }: IFilterBoxContainerProps) {
    const dispatch = Dispatch()
  function returnNameOfModals(obj: FilterDataObj) {
    let arr = [];
    const objData = obj.makeAndModalStates;
    for (let items in objData) {
      if (objData[items as keyof typeof objData] === true) {
        arr.push(items);
      }
    }
    return arr;
  }
  function checkPriceFilter(obj: FilterDataObj) {
    const regularHigh = 1750000;
    const regularLow = 0;

    //  const regLowMileage = 0
    //  const regHighMileage = 300000
    if (obj.lowPrice !== regularLow) {
      return true;
    } else if (obj.highPrice !== regularHigh) {
      return true;
    } else {
      return false;
    }
  }

  function checkMileageFilter(obj: FilterDataObj) {
    let regularHigh = 300000;
    let regularLow = 0;

    if (obj.highMileage !== regularHigh) {
      return true;
    } else if (obj.lowMileage !== regularLow) {
      return true;
    } else {
      return false;
    }
  }

  
  return (
    <div className="w-full h-auto flex flex-col">
      {returnNameOfModals(state).length || checkPriceFilter(state) || checkMileageFilter(state) ? (
        <div className="w-full h-auto flex flex-col py-4 px-4 border border-gray-300 rounded-lg bg-gray-100 dark:bg-inherit">
          <div className="w-full flex items-center justify-between mb-3 text-lightText dark:text-darkText">
            <h1 className="text-[17px] font-medium">Filters</h1>
            <h1
              className=" underline cursor-pointer text-[13px]"
              onClick={() => {
                dispatch(clearFilters(clearReduxState))
              }}
            >
              Clear All
            </h1>
          </div>

          <div className="w-full h-auto flex items-center flex-wrap">
            {returnNameOfModals(state).length ? (
              returnNameOfModals(state).map((item: any, index: any) => <FilterBoxMakeAndModal item={item} key={index} />)
            ) : <></>}
            {checkPriceFilter(state)  ? <FilterBoxPrice lowPrice={state.lowPrice} highPrice={state.highPrice}/> : <></>}
            {checkMileageFilter(state)  ? <FilterBoxMileage lowMileage={state.lowMileage} highMileage={state.highMileage}/> : <></>}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
