import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import { filterData, searchCars, setSearchedCars } from "../../redux/features/carSlice";
import { Skeleton, Pagination} from "@mui/material";
import CarVanaCard from "../../components/cards/CarVanaCard";
import CarDotComCard from "../../components/cards/CarDotComCard";
import { setCurrentPage } from "../../redux/features/carStateSlice";
import NoData from "../NoData/NoData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CarvanaPageInputs from "./CarvanaPageInputs/CarvanaPageInputs";
import debounce from "lodash.debounce";

import SortByStateMenu from "./components/SortByStateMenu";
import MobileCarvana from "./components/MobileCarvana";
import SearchDropDown from "./components/SearchDropDown";

export default function Cars() {
  const { carVana, loading, error } = UseSelector((state) => state.car);
  const { currentPage, filterStates } = UseSelector((state) => state.page);
  const { lightAndDarkMode } = UseSelector((state) => state.app);
  const dispatch = Dispatch();

  // Search State
  const [inputVal, setInputVal] = React.useState("");




  const sendRequest = React.useCallback((value: string) => {
    //console.log("Changed value:", value);
    dispatch(searchCars({ searchValue: value }));
  }, []); // eslint-disable-line

  // memoize the debounce call with useMemo
  const debouncedSendRequest = React.useMemo(() => {
    return debounce(sendRequest, 1000);
  }, [sendRequest]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputVal(e.target.value);
    debouncedSendRequest(e.target.value);
  }

  // Pagination Stuff
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setCurrentPage(value));
    window.scrollTo(0, 0);
  };

  // Outside Click Function
  const refOne = React.useRef<any>(null);
  const [openBox, setOpenBox] = React.useState<boolean>(false);

  function handleClickOutside(e: any) {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpenBox(false);
    }
  }

  React.useEffect(() => {
    document.body.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  React.useEffect(() => {
    dispatch(filterData({ ...filterStates, page: currentPage }));
  }, [currentPage, filterStates]); // eslint-disable-line

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  React.useEffect(() => {
    if (inputVal.length) {
      setOpenBox(true);
    } else {
      dispatch(setSearchedCars());
      setInputVal("");
      setOpenBox(false);
    }
  }, [inputVal]); // eslint-disable-line


  return (
    <div className="w-full min-h-screen  lg:px-8 md:px-4 px-2 flex pt-[50px] text-lightText dark:text-darkText">
      {/* Desktop Content */}
      <div className="w-full h-auto lg:flex hidden">
        {/* Left Side Sidebars */}
        <div className="w-[28%] overflow-y-auto fixed top-[100px] bottom-0 flex flex-col ">
          <CarvanaPageInputs />
        </div>

        {/* Right Side Content */}
        <div className="w-full h-auto flex justify-end">
          <div className="ml-[200px] relative w-[70%] flex flex-col  px-4">
            {/* Content */}
            <div className="w-full flex flex-col overflow-y-auto h-auto">
              <h1 className="text-[13px]  font-medium text italic mb-2">{carVana?.totalCount} results</h1>

              <div className="w-full h-auto mb-4 flex flex-col relative">
                <input
                  type="text"
                  className="w-full  border-gray-500 outline-none rounded-sm indent-2 border h-[50px] text-black"
                  placeholder="Search for brand, shoe, etc."
                  onChange={handleChange}
                  value={inputVal}
                />

                <SearchDropDown openBox={openBox} refOne={refOne} setInputVal={setInputVal} inputVal={inputVal} />
              </div>

              {/* Sorting */}
              <SortByStateMenu filterStates={filterStates} />

              {/* Mapped Data */}
              {!loading ? (
                carVana?.cars?.length ? (
                  <div className="w-full h-auto grid xl:grid-cols-3  grid-cols-2 gap-3 pt-4">
                    {carVana?.cars?.map((item: any, index: any) => (item?.type !== "Cars.com" ? <CarVanaCard item={item} key={index} /> : <CarDotComCard item={item} key={index} />))}
                  </div>
                ) : (
                  <NoData />
                )
              ) : (
                <div className="w-full h-auto grid xl:grid-cols-3  grid-cols-2 gap-3 pt-4">
                  {Array.from(Array(18).keys()).map((item: any, index: any) => (
                    <Skeleton key={index} variant="rectangular" className="w-full h-[300px]" />
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="w-full h-auto my-10 flex justify-center">
                <Pagination
                  count={carVana?.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  className=""
                  variant="outlined"
                  size="large"
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
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      {<MobileCarvana handlePageChange={handlePageChange} currentPage={currentPage} openBox={openBox} refOne={refOne} setInputVal={setInputVal} handleChange={handleChange} inputVal={inputVal} />}
    </div>
  );
}
