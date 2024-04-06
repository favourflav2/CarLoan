import * as React from "react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ClearIcon from "@mui/icons-material/Clear";
import { Menu, MenuItem, Skeleton, buttonBaseClasses } from "@mui/material";
import { Dispatch, UseSelector } from "../../redux/store";
import { setSearchState } from "../../redux/features/carStateSlice";
import { searchCars, setSearchedCars } from "../../redux/features/carSlice";
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { setLightAndDarkMode } from "../../redux/features/applicationSlice";
import { useLocation, useNavigate } from "react-router-dom";


export interface INavBarProps {}

export default function NavBar(props: INavBarProps) {
  // Redux State
  const {lightAndDarkMode} = UseSelector(state => state.app)
  const dispatch = Dispatch()
  const navigate = useNavigate()
  const pathName = useLocation()




// Click Outside Close
const refOne = React.useRef<any>(null);
  const [openBox, setOpenBox] = React.useState<boolean>(false);
function handleClickOutside(e: any) {
  if (refOne.current && !refOne.current.contains(e.target)) {
    setOpenBox(false);
  }
}

  // Light And Dark Functionality
  React.useEffect(() => {
    if (lightAndDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [lightAndDarkMode]);


  

  // w-full h-[75px] sticky top-0 z-10  backdrop-blur-lg bg-gray-50 border border-b
  // backdrop-blur-lg

  return (
    <div className="w-full h-[75px] sticky top-0 z-20 bg-inherit border-b border-gray-300 dark:border-gray-800">
      {/* Content */}
      <div className="w-full h-full flex items-center justify-between px-4 dark:text-homeText text-lightSmallNavBarBg">
        <h1 className="text-[19px]">Finance Tracker</h1>

        <div className="w-auto flex items-center dark:text-homeText text-lightSmallNavBarBg">
          <h1 className="dark:text-darkText text-lightText rounded-md p-2 mr-2  cursor-pointer" onClick={()=>navigate('/')}>Home</h1>
          <h1 className="dark:text-darkText text-lightText rounded-md p-2 mr-2  cursor-pointer" onClick={()=>navigate('/cars')}>Cars</h1>
          {/* <h1 className="dark:text-darkText text-lightText rounded-md p-2 mr-2  cursor-pointer">Login</h1>
          <h1 className="dark:text-darkText text-lightText rounded-md p-2 mr-2  cursor-pointer">Sign Up</h1> */}
          {lightAndDarkMode ? <button className="dark:text-darkText text-lightText rounded-md p-2 mr-2  cursor-pointer"><WbSunnyOutlinedIcon onClick={()=> dispatch(setLightAndDarkMode())} /></button> : <button className="dark:text-darkText text-lightText rounded-md p-2 mr-2  cursor-pointer"><NightlightOutlinedIcon onClick={()=> dispatch(setLightAndDarkMode())}/></button>}
        </div>
      </div>
    </div>
  );
}

