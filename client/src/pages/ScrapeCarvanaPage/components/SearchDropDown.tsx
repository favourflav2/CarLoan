import * as React from "react";
import { UseSelector } from "../../../redux/store";
import { Skeleton } from "@mui/material";
import { CarVanaDataObj } from "../../../redux/features/carSlice";
import { useNavigate } from "react-router-dom";

export interface ISearchDropDownProps {
  openBox: boolean;
  refOne: React.MutableRefObject<any>;
  setInputVal: React.Dispatch<React.SetStateAction<string>>
  inputVal:string;
}

export default function SearchDropDown({ openBox, refOne, setInputVal, inputVal }: ISearchDropDownProps) {
  const { searchError, searchedCars, searchLoading } = UseSelector((state) => state.car);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (searchError) {
      alert(searchError);
    }
  }, [searchError]);
  return (
    <>
      {openBox && (
        <div className="w-full max-h-[250px] absolute bg-white dark:bg-[#1a120e] top-[51px]  z-10 overflow-y-auto border border-gray-500" ref={refOne}>
          {/* Content */}
          <div className="w-full flex flex-col h-full overflow-y-auto">
            {searchLoading ? (
              <div className="w-full flex flex-col h-auto">
                {Array.from(Array(6).keys()).map((item: any, index: any) => (
                  <Skeleton key={index} variant="rectangular" className="w-full h-[40px] my-1" />
                ))}
              </div>
            ) : searchedCars.length ? (
              searchedCars.map((item: CarVanaDataObj) => (
                <div
                  key={item.index}
                  className="w-full flex items-center justify-between py-[8px]  px-2  cursor-pointer transition ease-in-out delay-100 hover:bg-chartGreen dark:hover:dark:bg-[RGBA(0,163,108,0.2)]  duration-300 group   group"
                  onClick={()=>{
                    navigate(`/vehicle/${item.index}`)
                    setInputVal("")
                  }}
                >
                  {" "}
                  <h1 className="md:text-[15.5px] text-[12px]  group-hover:text-white font-medium transition ease-in-out delay-100   duration-300">{item.name_modal}</h1>
                  <h1 className="text-[10px] font-bold group-hover:text-white transition ease-in-out delay-100   duration-300">{item?.type === "Carvana Certified" ? "Carvana" : "Cars.com"}</h1>
                </div>
              ))
            ) : (
              <div className=" py-4 px-4  cursor-pointer h-full w-full text-gray-700 bg-slate-200">
                <h1 className="text-[15.5px] ">No results for <span className="font-bold italic">{`"${inputVal}"`}</span> </h1>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
