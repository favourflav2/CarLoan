import { Pagination, Skeleton, Badge, useMediaQuery } from "@mui/material";
import * as React from "react";
import { FilterDataObj } from "../../../redux/features/carStateSlice";
import SortByStateMenu from "./SortByStateMenu";
import NoData from "../../NoData/NoData";
import CarVanaCard from "../../../components/cards/CarVanaCard";
import CarDotComCard from "../../../components/cards/CarDotComCard";
import MobileCarvanaModal from "./MobileCarvanaModal";
import TuneIcon from "@mui/icons-material/Tune";
import { UseSelector } from "../../../redux/store";
import SearchDropDown from "./SearchDropDown";

export interface IMobileCarvanaProps {
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  currentPage: number;
  refOne: React.MutableRefObject<any>;
  openBox: boolean;
  setInputVal: React.Dispatch<React.SetStateAction<string>>;
  handleChange(e: React.ChangeEvent<HTMLInputElement>): void;
  inputVal: string;
}

export default function MobileCarvana({ handlePageChange, currentPage, setInputVal, openBox, refOne, inputVal, handleChange }: IMobileCarvanaProps) {
  // Redux States
  const { loading, carVana } = UseSelector((state) => state.car);
  const { filterStates } = UseSelector((state) => state.page);
  const { lightAndDarkMode } = UseSelector((state) => state.app);

  // Meida Query
  const smBreakPoint = useMediaQuery("(min-width:640px)");

  // Modal State
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  // Get number of filters
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

  function getNumberOfFiltersForBagde(obj: FilterDataObj) {
    const { makeAndModalStates } = obj;

    const arr = [];

    for (let items in makeAndModalStates) {
      if (makeAndModalStates[items as keyof typeof makeAndModalStates] === true) {
        arr.push(items);
      }
    }

    if (checkMileageFilter(obj)) {
      arr.push("mileage");
    }
    if (checkPriceFilter(obj)) {
      arr.push("price");
    }
    return arr.length;
  }

  return (
    <div className="w-full h-auto lg:hidden flex p-4">
      {/* Container */}
      <div className="flex flex-col w-full h-auto">
        <h1 className="text-[13px]  font-medium text italic mb-2">{carVana?.totalCount} results</h1>

        {/* Search Bar */}
        <div className="w-full flex items-center justify-between h-auto py-3  mb-5" ref={refOne}>
          <div className="w-full h-auto relative">
            <input
              type="text"
              className="w-full mr-1  border-gray-500 outline-none rounded-sm indent-2 border h-[50px]"
              placeholder="Search for brand, shoe, etc."
              onChange={handleChange}
              value={inputVal}
            />
            {/* Dropdown Search Options */}
            <SearchDropDown openBox={openBox} refOne={refOne} setInputVal={setInputVal} inputVal={inputVal} />
          </div>
          {/* Filter Btn */}
          <div className="w-[100px] flex items-center justify-end  h-auto ">
            <Badge badgeContent={getNumberOfFiltersForBagde(filterStates)} color="primary">
              <TuneIcon className=" cursor-pointer" onClick={() => handleOpen()} />
            </Badge>
            <h1 className=" cursor-pointer ml-3" onClick={() => handleOpen()}>
              Filter
            </h1>
          </div>
        </div>

        {/* Sorting */}
        <SortByStateMenu filterStates={filterStates} />

        {/* Mapped Data */}
        <div className="">
          {loading ? (
            <div className="w-full h-auto grid min-[445px]:grid-cols-2 md:grid-cols-3 grid-cols-1  gap-3 pt-4">
              {Array.from(Array(18).keys()).map((item: any, index: any) => (
                <Skeleton key={index} variant="rectangular" className="w-full h-[300px]" />
              ))}
            </div>
          ) : carVana?.cars?.length ? (
            <div className="w-full h-auto grid min-[445px]:grid-cols-2 md:grid-cols-3 grid-cols-1  gap-3 pt-4">
              {carVana?.cars?.map((item: any, index: any) => (item?.type !== "Cars.com" ? <CarVanaCard item={item} key={index} /> : <CarDotComCard item={item} key={index} />))}
            </div>
          ) : (
            <NoData />
          )}
        </div>

        {/* Pagination */}
        <div className="w-full h-auto my-10 flex justify-center">
          <Pagination
            count={carVana?.totalPages}
            page={currentPage}
            onChange={handlePageChange}
            className=""
            variant="outlined"
            size={`${smBreakPoint ? "medium" : "small"}`}
            siblingCount={2}
            boundaryCount={1}
            sx={{
              "& .MuiPaginationItem-root": {
                borderColor: `${lightAndDarkMode ? "#d1d5db" : "gray"}`,
                color: `${lightAndDarkMode ? "#d1d5db" : "black"}`,
                "&.Mui-selected": {
                  background: `${lightAndDarkMode ? "#d1d5db" : "gray"}`,
                  color: `${lightAndDarkMode ? "black" : "black"}`,
                },
              },
            }}
          />
        </div>

        {/* Modal */}
        <MobileCarvanaModal
          setOpenModal={setOpenModal}
          openModal={openModal}
          handleOpen={handleOpen}
          handleClose={handleClose}
          filterStates={filterStates}
          getNumberOfFiltersForBagde={getNumberOfFiltersForBagde}
        />
      </div>
    </div>
  );
}
