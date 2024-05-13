import * as React from "react";
import { Dispatch, UseSelector } from "../../redux/store";
import {  filterData, searchCars, setSearchedCars } from "../../redux/features/carSlice";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SortIcon from "@mui/icons-material/Sort";
import { Divider, Skeleton, Pagination, Modal } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CarVanaCard from "../../components/cards/CarVanaCard";
import CarDotComCard from "../../components/cards/CarDotComCard";
import {  setCurrentPage } from "../../redux/features/carStateSlice";
import NoData from "../NoData/NoData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClearIcon from "@mui/icons-material/Clear";
import CarvanaPageInputs from "./CarvanaPageInputs/CarvanaPageInputs";

import SortByStateMenu from "./components/SortByStateMenu";

export default function Cars() {
  const { carVana, loading, error, searchedCars } = UseSelector((state) => state.car);
  const {  currentPage,  searchState, filterStates } = UseSelector((state) => state.page);
  const dispatch = Dispatch();




  // Filter States Open and Close
  const [priceArrow, setPriceArrow] = React.useState(false);
  const [makeAndModal, setMakeAndModal] = React.useState(false);
  const [mileageArrow, setMileageArrow] = React.useState(false);

  // Sort By Box Open State
  const [openSortBy, setOpenSortBy] = React.useState(false);

  // Modal State
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

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
     dispatch(filterData({...filterStates,page:currentPage}))
   }, [currentPage, filterStates]); // eslint-disable-line

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  React.useEffect(() => {
    if (searchState?.length) {
      dispatch(searchCars({ searchVal: searchState }));
      setOpenBox(true);
    } else {
      dispatch(setSearchedCars());
      setOpenBox(false);
    }
  }, [searchState]); // eslint-disable-line

  //! Im going to add a new page for my search bar stuff ... like how I do item details page ... that way when we search we go to a new page with a new state ... this allows me to keep my orginal state intact


  return (
    <div className="w-full h-auto lg:px-8 md:px-4 px-2 flex pt-[50px] text-lightText dark:text-darkText">
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

              {/* Sorting */}
              <SortByStateMenu filterStates={filterStates}/>

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
              <div className="w-full h-auto mt-6 mb-10 flex justify-center">
                <Pagination count={carVana?.totalPages} page={currentPage} onChange={handlePageChange} className="" variant="outlined" size="large" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="w-full h-auto lg:hidden flex p-4">
        {/* Container */}
        <div className="flex flex-col w-full h-auto">
          <h1 className="text-[13px]  font-medium text italic mb-2">{carVana?.totalCount} results</h1>

          {/* Search Bar */}
          <div className="w-full flex items-center h-auto py-3 relative mb-5" ref={refOne}>
            <input
              type="text"
              className="md:w-full sm:w-[85%] w-[80%] sm:mr-0 mr-1  border-gray-500 outline-none rounded-sm indent-2 border h-[50px]"
              placeholder="Search for brand, shoe, etc."
              onChange={(e) => {
                //dispatch(setSearchState(e.target.value));
              }}
              value={searchState}
            />
            {/* Filter Btn */}
            <div className="md:w-[13%] sm:w-[15%] lg:w-[20%] flex items-center justify-end ">
              {/* <Badge badgeContent={getNumberOfFiltersForBagde({ nameFilters: reduxMakeAndModalStates, pricefilters: price, mileageFilter: mileage })} color="primary">
                <TuneIcon className=" cursor-pointer" onClick={() => handleOpen()} />
              </Badge> */}
              <h1 className=" cursor-pointer ml-3" onClick={() => handleOpen()}>
                Filter
              </h1>
            </div>

            {/* Dropdown Search Options */}
            {openBox && (
              <div className="md:w-[88%] sm:w-[85%] w-[80%] h-auto absolute bg-slate-100 top-[60px] mt-2 px-1 z-10">
                {loading ? (
                  <div className="w-full flex flex-col h-auto">
                    {Array.from(Array(6).keys()).map((item: any, index: any) => (
                      <Skeleton key={index} variant="rectangular" className="w-full h-[40px] my-1" />
                    ))}
                  </div>
                ) : searchedCars.length ? (
                  searchedCars?.map((item: any, index: any) => (
                    <div
                      className="py-[8px]  px-4  cursor-pointer transition ease-in-out delay-100 hover:bg-black  duration-300 group border-b border-gray-300 flex items-center justify-between group"
                      key={index}
                    >
                      <h1 className="md:text-[15.5px] text-[12px]  group-hover:text-gray-300 font-medium transition ease-in-out delay-100   duration-300">{item.name_modal}</h1>
                      <h1 className="text-[10px] font-bold group-hover:text-gray-300 transition ease-in-out delay-100   duration-300">{item?.type === "Carvana Certified" ? "Carvana" : "Cars.com"}</h1>
                    </div>
                  ))
                ) : (
                  <div className=" py-4 px-4  cursor-pointer h-full w-full bg-slate-200">
                    <h1 className="text-[15.5px] ">No results for {`"${searchState}"`} </h1>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sorting */}
          <div className="flex justify-between items-center w-full h-auto mb-2">
            <LocationOnIcon />

            <div className="flex items-center">
              <div className="flex items-center relative">
                <SortIcon className="mr-[3px] text-[20px] cursor-pointer" onClick={() => setOpenSortBy((val) => !val)} />
                <span className="md:text-base text-[12px] cursor-pointer" onClick={() => setOpenSortBy((val) => !val)}>
                   Sort By {filterStates.sortByState} 
                </span>

               
                {openSortBy && (
                  <div className="w-[200px] h-auto border-2 border-gray-300 bg-white absolute top-8 left-[-50px]">
                    {/* Content */}
                    <div className="flex flex-col w-full h-full ">
                      <h1
                        className={`my-1 text-[14px] mt-2 cursor-pointer transition ease-in-out delay-100 ${
                          filterStates.sortByState === "All" ? "bg-teal-400 text-black hover:bg-teal-500" : "hover:bg-black hover:text-white"
                        }  duration-300 group px-2 py-1`}
                        // onClick={() => {
                        //   setOpenSortBy(false);
                        //   //dispatch(setSortByState("All"));
                        //   setSearchParams((searchParams) => {
                        //     searchParams.set("sort", "All");
                        //     return searchParams;
                        //   });
                        //   dispatch(
                        //     filterStates({
                        //       page: currentPage,
                        //       price: price,
                        //       sortByState: "All",
                        //       modal: reduxMakeAndModalStates,
                        //       mileage,
                        //     })
                        //   );
                        //   dispatch(setCurrentPage(1));
                        // }}
                      >
                        ALL
                      </h1>
                      <h1
                        className={`my-1 text-[14px]  cursor-pointer transition ease-in-out delay-100 ${
                          filterStates.sortByState === "Highest Price" ? "bg-teal-400 text-black hover:bg-teal-500" : "hover:bg-black hover:text-white"
                        } duration-300 group px-2 py-1`}
                        // onClick={() => {
                        //   setOpenSortBy(false);
                        //   //dispatch(setSortByState("Highest Price"));
                        //   setSearchParams((searchParams) => {
                        //     searchParams.set("sort", "Highest Price");
                        //     return searchParams;
                        //   });
                        //   dispatch(
                        //     filterStates({
                        //       page: currentPage,
                        //       price: price,
                        //       sortByState: "Highest Price",
                        //       modal: reduxMakeAndModalStates,
                        //       mileage,
                        //     })
                        //   );
                        //   dispatch(setCurrentPage(1));
                        // }}
                      >
                        HIGHEST PRICE
                      </h1>
                      <h1
                        className={`my-1 text-[14px]  cursor-pointer transition ease-in-out delay-100 ${
                          filterStates.sortByState === "Lowest Price" ? "bg-teal-400 text-black hover:bg-teal-500" : "hover:bg-black hover:text-white"
                        } duration-300 group px-2 py-1`}
                        // onClick={() => {
                        //   setOpenSortBy(false);
                        //   //dispatch(setSortByState("Lowest Price"));
                        //   setSearchParams((searchParams) => {
                        //     searchParams.set("sort", "Lowest Price");
                        //     return searchParams;
                        //   });
                        //   dispatch(
                        //     filterStates({
                        //       page: currentPage,
                        //       price: price,
                        //       sortByState: "Lowest Price",
                        //       modal: reduxMakeAndModalStates,
                        //       mileage,
                        //     })
                        //   );
                        //   dispatch(setCurrentPage(1));
                        // }}
                      >
                        LOWEST PRICE
                      </h1>
                      <h1
                        className={`my-1 text-[14px]  cursor-pointer transition ease-in-out delay-100 ${
                          filterStates.sortByState === "Lowest Mileage" ? "bg-teal-400 text-black hover:bg-teal-500" : "hover:bg-black hover:text-white"
                        } duration-300 group px-2 py-1 mb-2`}
                        // onClick={() => {
                        //   setOpenSortBy(false);
                        //   //dispatch(setSortByState("Lowest Mileage"));
                        //   setSearchParams((searchParams) => {
                        //     searchParams.set("sort", "Lowest Mileage");
                        //     return searchParams;
                        //   });
                        //   dispatch(
                        //     filterStates({
                        //       page: currentPage,
                        //       price: price,
                        //       sortByState: "Lowest Mileage",
                        //       modal: reduxMakeAndModalStates,
                        //       mileage,
                        //     })
                        //   );
                        //   dispatch(setCurrentPage(1));
                        // }}
                      >
                        LOWEST MILEAGE
                      </h1>
                    </div>
                  </div>
                )}
              </div>
              <Divider orientation="vertical" flexItem className="mx-2 text-black" />
              <div className="flex items-center text-gray-300">
                <FavoriteBorderIcon className="mr-[3px] text-[20px]" /> <span className="md:text-base text-[12px]">Save Search</span>
              </div>
            </div>
          </div>

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
          <div className="w-full h-auto mt-6 mb-10 flex justify-center">
            <Pagination count={carVana?.totalPages} page={currentPage} onChange={handlePageChange} className="" variant="outlined" size="large" />
          </div>

          {/* Modal */}
          <Modal onClose={handleClose} open={openModal}>
            <div className="md:w-[90%] w-full md:max-h-[780px] max-h-full flex  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-50 rouned-sm overflow-y-auto ">
              {/* Content */}
              <div className="w-full h-full flex flex-col p-2 flex-wrap relative ">
                {/* Title */}
                <div className="w-full flex items-center justify-between border-b border-gray-300 py-4 px-4">
                  <h1 className="text-[25px] font-medium">Filters</h1>
                  <ClearIcon className="text-[25px]" onClick={() => setOpenModal(false)} />
                </div>

                {/* All Filters */}
                <div className="w-full h-auto flex flex-col">
                  {/* Price */}
                  <div className="w-full h-auto flex flex-col border-b border-gray-300">
                    <div className=" flex justify-between items-center py-4 px-4 h-auto ">
                      <h1 className="text-[19px] font-medium">Price</h1>
                      <KeyboardArrowUpIcon onClick={() => setPriceArrow((val) => !val)} />
                    </div>

                    {/* Price Box */}
                    {/* {priceArrow && (
                      <div className=" flex flex-col w-full py-3 h-auto px-4">
                        <div className="w-full h-auto flex items-center">
                          <h1 className="text-[13px] mr-2">PRICE RANGE:</h1>

                          <NumericFormat
                            value={price.lowPrice}
                            customInput={TextField}
                            onChange={(e) => {
                              //dispatch(setPricePersist({ type: "lowPrice", value: e.target.value }));
                            }}
                            prefix={"$"}
                            thousandSeparator={true}
                            className=" outline-none border border-gray-400 indent-1 rounded-sm w-[150px] "
                          />
                          <span className="mx-2">-</span>
                          <NumericFormat
                            value={price.highPrice}
                            customInput={TextField}
                            onChange={(e) => {
                              //dispatch(setPricePersist({ type: "highPrice", value: e.target.value }));
                            }}
                            prefix={"$"}
                            thousandSeparator={true}
                            className=" outline-none border border-gray-400 indent-1 rounded-sm w-[150px] "
                          />
                        </div>
                      </div>
                    )} */}
                  </div>

                  {/* Make and Modal */}
                  <div className="w-full h-auto flex flex-col border-b border-gray-300 ">
                    <div className=" flex justify-between items-center py-4 px-4 h-auto ">
                      <h1 className="text-[19px] font-medium">Make and Modal</h1>
                      <KeyboardArrowUpIcon onClick={() => setMakeAndModal((val) => !val)} />
                    </div>

                    {/* Modal Box */}
                    {makeAndModal && (
                      // <div className=" flex flex-col w-full py-3 h-auto px-4 ">
                      //   <div className="w-full md:max-h-[500px] flex justify-start ">
                      //     <FormGroup>
                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Acura}
                      //         label={<Typography>Acura</Typography>}
                      //         name="Acura"
                      //         onChange={(e) => {
                      //           handleChangeMakeAndModal(e);
                      //         }}
                      //       />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.AlfaRomeo}
                      //         label={<Typography>Alfa Romeo</Typography>}
                      //         name="AlfaRomeo"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.Audi} label={<Typography>Audi</Typography>} name="Audi" onChange={handleChangeMakeAndModal} />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.BMW} label={<Typography>BMW</Typography>} name="BMW" onChange={handleChangeMakeAndModal} />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.Buick} label={<Typography>Buick</Typography>} name="Buick" onChange={handleChangeMakeAndModal} />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Cadillac}
                      //         label={<Typography>Cadillac</Typography>}
                      //         name="Cadillac"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Chevrolet}
                      //         label={<Typography>Chevrolet</Typography>}
                      //         name="Chevrolet"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Chrysler}
                      //         label={<Typography>Chrysler</Typography>}
                      //         name="Chrysler"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.Dodge} label={<Typography>Dodge</Typography>} name="Dodge" onChange={handleChangeMakeAndModal} />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.FIAT} label={<Typography>FIAT</Typography>} name="FIAT" onChange={handleChangeMakeAndModal} />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.Ford} label={<Typography>Ford</Typography>} name="Ford" onChange={handleChangeMakeAndModal} />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Genesis}
                      //         label={<Typography>Genesis</Typography>}
                      //         name="Genesis"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.GMC} label={<Typography>GMC</Typography>} name="GMC" onChange={handleChangeMakeAndModal} />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.Honda} label={<Typography>Honda</Typography>} name="Honda" onChange={handleChangeMakeAndModal} />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Hyundai}
                      //         label={<Typography>Hyundai</Typography>}
                      //         name="Hyundai"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.INFINITI}
                      //         label={<Typography>INFINITI</Typography>}
                      //         name="INFINITI"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Jaguar}
                      //         label={<Typography>Jaguar</Typography>}
                      //         name="Jaguar"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.Jeep} label={<Typography>Jeep</Typography>} name="Jeep" onChange={handleChangeMakeAndModal} />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.Kia} label={<Typography>Kia</Typography>} name="Kia" onChange={handleChangeMakeAndModal} />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.LandRover}
                      //         label={<Typography>Land Rover</Typography>}
                      //         name="LandRover"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.Lexus} label={<Typography>Lexus</Typography>} name="Lexus" onChange={handleChangeMakeAndModal} />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Lincoln}
                      //         label={<Typography>Lincoln</Typography>}
                      //         name="Lincoln"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.Lucid} label={<Typography>Lucid</Typography>} name="Lucid" onChange={handleChangeMakeAndModal} />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Maserati}
                      //         label={<Typography>Maserati</Typography>}
                      //         name="Maserati"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Mazada}
                      //         label={<Typography>Mazada</Typography>}
                      //         name="Mazada"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.MercedesBenz}
                      //         label={<Typography>Mercedes-Benz</Typography>}
                      //         name="MercedesBenz"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.MINI} label={<Typography>MINI</Typography>} name="MINI" onChange={handleChangeMakeAndModal} />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Mitsubishi}
                      //         label={<Typography>Mitsubishi</Typography>}
                      //         name="Mitsubishi"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Nissan}
                      //         label={<Typography>Nissan</Typography>}
                      //         name="Nissan"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Polestar}
                      //         label={<Typography>Polestar</Typography>}
                      //         name="Polestar"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Porsche}
                      //         label={<Typography>Porsche</Typography>}
                      //         name="Porsche"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.Ram} label={<Typography>Ram</Typography>} name="Ram" onChange={handleChangeMakeAndModal} />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Rivian}
                      //         label={<Typography>Rivian</Typography>}
                      //         name="Rivian"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.Scion} label={<Typography>Scion</Typography>} name="Scion" onChange={handleChangeMakeAndModal} />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Subaru}
                      //         label={<Typography>Subaru</Typography>}
                      //         name="Subaru"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.Telsa} label={<Typography>Telsa</Typography>} name="Telsa" onChange={handleChangeMakeAndModal} />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Toyota}
                      //         label={<Typography>Toyota</Typography>}
                      //         name="Toyota"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel
                      //         control={<Checkbox />}
                      //         checked={reduxMakeAndModalStates.Volkswagen}
                      //         label={<Typography>Volkswagen</Typography>}
                      //         name="Volkswagen"
                      //         onChange={handleChangeMakeAndModal}
                      //       />

                      //       <FormControlLabel control={<Checkbox />} checked={reduxMakeAndModalStates.Volvo} label={<Typography>Volvo</Typography>} name="Volvo" onChange={handleChangeMakeAndModal} />
                      //     </FormGroup>
                      //   </div>
                      // </div>
                      <></>
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
                    // //   <div className=" flex flex-col w-full py-3 h-auto px-4">
                    // //     <div className="w-full h-auto flex items-center">
                    // //       <h1 className="text-[13px] mr-2">MILEAGE RANGE:</h1>

                    // //       <NumericFormat
                    // //         value={mileage.lowMileage}
                    // //         customInput={TextField}
                    // //         onChange={(e) => {
                    // //           //dispatch(setMileagePersist({ type: "lowMileage", value: e.target.value }));
                    // //         }}
                    // //         thousandSeparator={true}
                    // //         className=" outline-none border border-gray-400 indent-1 rounded-sm w-[150px] "
                    // //       />
                    // //       <span className="mx-2">-</span>
                    // //       <NumericFormat
                    // //         value={mileage.highMileage}
                    // //         customInput={TextField}
                    // //         onChange={(e) => {
                    // //           //dispatch(setMileagePersist({ type: "highMileage", value: e.target.value }));
                    // //         }}
                    // //         thousandSeparator={true}
                    // //         className=" outline-none border border-gray-400 indent-1 rounded-sm w-[150px] "
                    // //       />
                    // //     </div>

                    // //     {/* <button
                    // //   className="mt-4 p-2 bg-black text-white rounded-lg"
                    // //   onClick={() => {
                    // //     dispatch(
                    // //       filterStates({
                    // //         price: price,
                    // //         sortByState,
                    // //         modal: reduxMakeAndModalStates,
                    // //         page: currentPage,
                    // //         mileage,
                    // //       })
                    // //     );
                    // //     setMileageArrow(false);
                    // //     dispatch(setCurrentPage(1));
                    // //   }}
                    // // >
                    // //   Search
                    // // </button> */}
                    // //   </div>
                    <></>
                    )}
                  </div>

                  {/* Great Deals */}
                  <div className="w-full h-auto flex flex-col border-b border-gray-300">
                    <div className=" flex justify-between items-center py-4 px-4 h-auto ">
                      <h1 className="text-[19px] font-medium text-gray-300">Great Deals</h1>
                      <KeyboardArrowUpIcon className="text-gray-300" />
                    </div>
                  </div>

                  {/* MPG */}
                  <div className="w-full h-auto flex flex-col border-b border-gray-300">
                    <div className=" flex justify-between items-center py-4 px-4 h-auto ">
                      <h1 className="text-[19px] font-medium text-gray-300">MPG</h1>
                      <KeyboardArrowUpIcon className="text-gray-300" />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="w-full h-auto flex flex-col border-b border-gray-300">
                    <div className=" flex justify-between items-center py-4 px-4 h-auto ">
                      <h1 className="text-[19px] font-medium text-gray-300">Features</h1>
                      <KeyboardArrowUpIcon className="text-gray-300" />
                    </div>
                  </div>

                  {/* Exterior Colors */}
                  <div className="w-full h-auto flex flex-col border-b border-gray-300">
                    <div className=" flex justify-between items-center py-4 px-4 h-auto ">
                      <h1 className="text-[19px] font-medium text-gray-300">Exterior Colors</h1>
                      <KeyboardArrowUpIcon className="text-gray-300" />
                    </div>
                  </div>

                  {/* Interior Colors */}
                  <div className="w-full h-auto flex flex-col border-b border-gray-300">
                    <div className=" flex justify-between items-center py-4 px-4 h-auto ">
                      <h1 className="text-[19px] font-medium text-gray-300">Interior Colors</h1>
                      <KeyboardArrowUpIcon className="text-gray-300" />
                    </div>
                  </div>

                  {/* Seating Capacity */}
                  <div className="w-full h-auto flex flex-col border-b border-gray-300">
                    <div className=" flex justify-between items-center py-4 px-4 h-auto ">
                      <h1 className="text-[19px] font-medium text-gray-300">Seating Capacity</h1>
                      <KeyboardArrowUpIcon className="text-gray-300" />
                    </div>
                  </div>
                </div>

                {/* Clear All */}

                {/* {getNumberOfFiltersForBagde({ nameFilters: reduxMakeAndModalStates, pricefilters: price, mileageFilter: mileage }) > 0 && (
                  <div className=" w-full flex justify-center sticky bottom-0   h-[60px]">
                    <button className="w-full h-[50px] bg-black text-gray-300 rounded-full" onClick={() => dispatch(clearAllFilters())}>
                      Clear All
                    </button>
                  </div>
                )} */}
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}
