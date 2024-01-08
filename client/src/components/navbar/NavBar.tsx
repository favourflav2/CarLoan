import * as React from "react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ClearIcon from "@mui/icons-material/Clear";
import { Menu, MenuItem, Skeleton } from "@mui/material";
import { Dispatch, UseSelector } from "../../redux/store";
import { setSearchState } from "../../redux/features/websiteSlice";
import { searchCars, setSearchedCars } from "../../redux/features/carSlice";


export interface INavBarProps {}

export default function NavBar(props: INavBarProps) {
  // Redux State
  const { searchLoading, searchedCars } = UseSelector((state) => state.car);
  const {searchState} = UseSelector(state => state.page)
  const dispatch = Dispatch()

  const [searchOn, setSearchOn] = React.useState(false);
  

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


// Click Outside Close
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

  // Navbar Event Listener
  const [changeScroll, setChangeScroll] = React.useState(false);
  function changeColor() {
    if (window.scrollY > 90) {
      setChangeScroll(true);
    } else {
      setChangeScroll(false);
    }
  }
  React.useEffect(() => {
    window.addEventListener("scroll", changeColor);
    return () => window.removeEventListener("scroll", changeColor);
  });

  React.useEffect(()=>{
  if(searchState?.length){
    dispatch(searchCars({searchVal:searchState}))
    setOpenBox(true)
  }else{
    dispatch(setSearchedCars())
    setOpenBox(false)
  }
  },[searchState])// eslint-disable-line

  

  // w-full h-[75px] sticky top-0 z-10  backdrop-blur-lg bg-gray-50 border border-b

  return (
    <div className="w-full h-[75px] sticky top-0 z-20  backdrop-blur-lg bg-gray-50 border border-b">
      {/* Desktop Content */}
      <div className="w-full h-full lg:flex hidden py-4  items-center justify-between px-8">
        {/* Logo */}
        {!changeScroll && (
          <div className="flex w-auto items-center">
            <AttachMoneyIcon className="text-[45px]" />
            {/* Title */}
            <h1 className="xl:text-[22px] text-[18px]">Best Deals</h1>
          </div>
        )}

        {/* Search Bar */}
        <div className={`flex items-center ${changeScroll ? "w-full" : "md:w-[45%]"} h-[40px] rounded-sm border border-gray-400 relative `} ref={refOne}>
          <SearchIcon className="text-[18px] ml-1" />
          <input type="text" className="w-full h-full bg-inherit outline-none indent-2" placeholder="Search for brand, shoe, etc." onChange={(e) => {
            dispatch(setSearchState(e.target.value))
          }} value={searchState} />
          <ClearIcon className={`text-[18px] mr-1 ${searchState?.length ? "block" : "hidden"}`} onClick={()=>{
            dispatch(setSearchState(""))
          }}/>


          {/* Dropdown Search Options */}
          {openBox && 
          <div className="w-full h-auto absolute bg-slate-100 top-10 mt-2 px-1" >
          
            {
              searchLoading ? 
              (
                <div className="w-full flex flex-col h-auto">
                  {Array.from(Array(6).keys()).map((item: any, index: any) => (
                      <Skeleton key={index} variant="rectangular" className="w-full h-[40px] my-1" />
                    ))}
                </div>
              ) 
              : 
              (
                searchedCars.length ? 
                (
                  searchedCars?.map((item:any, index:any)=>(
                    <div className="py-[8px]  px-4  cursor-pointer transition ease-in-out delay-100 hover:bg-black  duration-300 group border-b border-gray-300 flex items-center justify-between group" key={index}>
                      <h1 className="text-[15.5px]  group-hover:text-gray-300 font-medium transition ease-in-out delay-100   duration-300">{item.name_modal}</h1>
                      <h1 className="text-[11px] font-bold group-hover:text-gray-300 transition ease-in-out delay-100   duration-300">{item?.type === "Carvana Certified" ? "From Carvana" : "From Cars.com"}</h1>
                    </div>
                  ))
                ) 
                : 
                (
                  <div className=" py-4 px-4  cursor-pointer h-full w-full bg-slate-200">
                  <h1 className="text-[15.5px] ">No results for {`"${searchState}"`} </h1>
                </div>
                )
              )
            }
            
          </div>}
        </div>

        {/* Right Side */}
        {!changeScroll && (
          <div className="w-auto h-full flex items-center">
            <h1 className="mx-2 font-medium hover:underline cursor-pointer transition ease-in-out delay-150 hover:-translate-y-[1px] hover:scale-105 duration-300">Browse</h1>
            <h1 className="mx-2 font-medium hover:underline cursor-pointer transition ease-in-out delay-150 hover:-translate-y-[1px] hover:scale-105 duration-300">News</h1>
            <h1 className="mx-2 font-medium hover:underline cursor-pointer transition ease-in-out delay-150 hover:-translate-y-[1px] hover:scale-105 duration-300">About</h1>
            <h1 className="mx-2 font-medium hover:underline cursor-pointer transition ease-in-out delay-150 hover:-translate-y-[1px] hover:scale-105 duration-300">Sell</h1>

            {/* Login/ SignUp */}
            <div className="w-auto h-full flex items-center ml-[30px]">
              <button className="border border-black h-[32px] w-[55px] font-medium transition ease-in-out delay-150 hover:-translate-y-[.5px] hover:scale-105 duration-300">Login</button>
              <button className="bg-black text-white h-[32px] w-[70px] ml-4 font-medium transition ease-in-out delay-150 hover:-translate-y-[.5px] hover:scale-105 duration-300">Sign Up</button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="w-full h-full lg:hidden flex py-4 md:px-4 px-2 items-center justify-between">
        {/* Menu */}
        <MenuIcon className="md:text-[35px] text-[28px]" onClick={handleClick} />

        {/* Logo */}
        {!searchOn && (
          <div className="flex w-auto items-center">
            <AttachMoneyIcon className="md:text-[35px] text-[28px]" />
            {/* Title */}
            <h1 className="md:text-[20px] text-[18px]">Best Deals</h1>
          </div>
        )}

        {/* Search Icon */}
        {!searchOn && (
          <SearchIcon
            className="md:text-[35px] text-[28px]"
            onClick={() => {
              setSearchOn((val) => !val);
            }}
          />
        )}

        {/* Search Bar */}
        {searchOn && (
          <div className="w-full h-full relative mx-2">
            {/* <input
              type="text"
              autoFocus
              className="w-full h-full bg-inherit outline-none border border-gray-300 indent-2"
              placeholder="Search for brand, shoe, etc."
              onChange={(e) => setSearchVal(e.target.value)}
              value={searchVal}
            /> */}

            {/* Dropdown Search Options */}
            <div className="w-full h-auto absolute bg-slate-100 top-10 mt-2">
              {/* Mapped Data */}
              {/* <div className="flex flex-col w-full h-auto mt-1 ">
                {searchVal ? (
                  searchGeneretor()?.length ? (
                    searchGeneretor()
                      ?.slice(0, 6)
                      .map((item: any, indes: any) => (
                        <div className=" py-[8px] px-4 my-1 cursor-pointer transition ease-in-out delay-100 hover:bg-black  duration-300 group">
                          <h1 className="text-[15.5px]  group-hover:text-gray-300 font-medium transition ease-in-out delay-100   duration-300">{item.name_modal}</h1>
                        </div>
                      ))
                  ) : (
                    <div className=" py-4 px-4  cursor-pointer h-full w-full bg-slate-200">
                      <h1 className="text-[15.5px] ">No results for {`"${searchVal}"`} </h1>
                    </div>
                  )
                ) : (
                  <></>
                )}
              </div> */}
            </div>
          </div>
        )}

        {/* Cancel Btn */}
        {searchOn && (
          <ClearIcon
            className=" md:text-current text-[25px] cursor-pointer "
            onClick={() => {
              setSearchOn((val) => !val);
            }}
          />
        )}

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}>Browse</MenuItem>
          <MenuItem onClick={handleClose}>News</MenuItem>
          <MenuItem onClick={handleClose}>Sell</MenuItem>
          <MenuItem onClick={handleClose}>Sign Up</MenuItem>
          <MenuItem onClick={handleClose}>Login</MenuItem>
        </Menu>
      </div>
    </div>
  );
}

