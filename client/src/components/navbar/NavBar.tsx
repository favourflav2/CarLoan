import * as React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem, useMediaQuery } from "@mui/material";
import { Dispatch, UseSelector } from "../../redux/store";
import NightlightOutlinedIcon from "@mui/icons-material/NightlightOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import { setLightAndDarkMode } from "../../redux/features/applicationSlice";
import { useLocation, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { setLogout } from "../../redux/features/authSlice";
import { isTokenExpired } from "../../redux/utils/isTokenExpired";



export interface INavBarProps {}

export default function NavBar(props: INavBarProps) {
  // Redux State
  const { lightAndDarkMode } = UseSelector((state) => state.app);
  const { user } = UseSelector((state) => state.auth);
  const dispatch = Dispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // user Id
  const userId = user?.userObj.id;
  const name = user?.userObj.name;
  const token = user?.token;

  const matches = useMediaQuery("(min-width:640px)");

  // Menu Mobile State
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function getFirstName(text: string | undefined) {
    if (!text) return;
    const firstName = text.split(" ");
    return firstName[0];
  }

  // Light And Dark Functionality
  React.useEffect(() => {
    if (lightAndDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [lightAndDarkMode]);

  // Jwt Decode
   React.useEffect(() => {
     if (token) {
       if (isTokenExpired(token)) {
         dispatch(setLogout());
         navigate("/");
         
       }
     }
   }, [token]); // eslint-disable-line

  if (
    pathname === "/auth/login" ||
    pathname === "/auth/signup" ||
    pathname === "/auth/forgotPassword" ||
    pathname === "/auth/checkEmail" ||
    pathname === "/auth/resetPassword"
  ) {
    return null;
  }

  return (
    <div className="w-full h-[75px] sticky top-0 z-20 bg-inherit border-b border-gray-300 dark:border-gray-800 dark:text-darkText text-lightText">
      {/* Desktop Content */}
      <div className="w-full h-full sm:flex hidden px-4 dark:text-homeText text-lightSmallNavBarBg">
        {/* Navbar stuff */}
        <div className="w-full flex items-center justify-between h-full">
          <h1 className="text-[19px]">Finance Tracker</h1>

          {/* <div className="w-auto sm:flex hidden items-center dark:text-homeText text-lightSmallNavBarBg">
            <h1 className="dark:text-darkText text-lightText rounded-md p-2 mr-2  cursor-pointer" onClick={() => navigate("/")}>
              Home
            </h1>
            <h1 className="dark:text-darkText text-lightText rounded-md p-2 mr-2  cursor-pointer" onClick={() => navigate("/cars")}>
              Cars
            </h1>

            {!userId && (
              <div className="w-auto flex items-center mx-2">
                <button className="p-2 rounded-sm mr-2 border border-gray-100 dark:shadow-none shadow-lg bg-white w-[80px] text-chartGreen " onClick={() => navigate("/auth/signup")}>
                  Sign Up
                </button>
                <button className="p-2 rounded-sm  border border-gray-100 bg-chartGreen/80 w-[80px] text-white" onClick={() => navigate("/auth/login")}>
                  Login
                </button>
              </div>
            )}

            {!userId && (
              <div className="w-auto flex h-auto">
                {lightAndDarkMode ? (
                  <button className="dark:text-darkText text-lightText rounded-md p-2 mr-2  cursor-pointer">
                    <WbSunnyOutlinedIcon onClick={() => dispatch(setLightAndDarkMode())} />
                  </button>
                ) : (
                  <button className="dark:text-darkText text-lightText rounded-md p-2 mr-2  cursor-pointer">
                    <NightlightOutlinedIcon onClick={() => dispatch(setLightAndDarkMode())} />
                  </button>
                )}
              </div>
            )}
          </div> */}

          {userId && <div className="w-auto flex items-center">
            <h1 className="dark:text-darkText text-lightText rounded-md p-2 mr-2  cursor-pointer" onClick={() => navigate("/")}>
              Home
            </h1>
            <h1 className="dark:text-darkText text-lightText rounded-md p-2 mr-2  cursor-pointer" onClick={() => navigate("/cars")}>
              Cars
            </h1>
          </div>}

          {userId && (
            <div className="w-auto sm:flex hidden items-center">
              <button className=" hover:underline " onClick={handleClick}>
                Hi, {getFirstName(name)}
              </button>
              <button onClick={handleClick}>
                <AccountCircleIcon className="text-chartGreen dark:text-chartGreen/90 text-[24px]" />
              </button>

              {userId && (
                <div className="w-auto flex h-auto">
                  {lightAndDarkMode ? (
                    <button className="dark:text-darkText text-lightText rounded-md p-2 ml-2  cursor-pointer">
                      <WbSunnyOutlinedIcon onClick={() => dispatch(setLightAndDarkMode())} />
                    </button>
                  ) : (
                    <button className="dark:text-darkText text-lightText rounded-md p-2 ml-2  cursor-pointer">
                      <NightlightOutlinedIcon onClick={() => dispatch(setLightAndDarkMode())} />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* No user buttons */}
        {!userId && (
          <div className="w-auto sm:flex hidden items-center dark:text-homeText text-lightSmallNavBarBg">
            <h1 className="dark:text-darkText text-lightText rounded-md p-2 mr-2  cursor-pointer" onClick={() => navigate("/")}>
              Home
            </h1>
            <h1 className="dark:text-darkText text-lightText rounded-md p-2 mr-2  cursor-pointer" onClick={() => navigate("/cars")}>
              Cars
            </h1>

            {/* Sign Up and Login Button */}
            <div className="w-auto flex items-center mx-2">
              <button
                className="p-2 rounded-sm mr-2 border border-gray-100 dark:shadow-none shadow-lg bg-white w-[80px] text-chartGreen "
                onClick={() => navigate("/auth/signup")}
              >
                Sign Up
              </button>
              <button className="p-2 rounded-sm  border border-gray-100 bg-chartGreen/80 w-[80px] text-white" onClick={() => navigate("/auth/login")}>
                Login
              </button>
            </div>

            <div className="w-auto flex h-auto">
              {lightAndDarkMode ? (
                <button className="dark:text-darkText text-lightText rounded-md p-2 mr-2  cursor-pointer">
                  <WbSunnyOutlinedIcon onClick={() => dispatch(setLightAndDarkMode())} />
                </button>
              ) : (
                <button className="dark:text-darkText text-lightText rounded-md p-2 mr-2  cursor-pointer">
                  <NightlightOutlinedIcon onClick={() => dispatch(setLightAndDarkMode())} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Content */}
      <div className="w-full h-full sm:hidden flex px-4 dark:text-homeText text-lightSmallNavBarBg">
        {/* Navbar stuff */}
        <div className="w-full flex items-center justify-between h-full">
          <h1 className="sm:text-[19px] text-base">Finance Tracker</h1>

          {!userId && (
            <div className="w-auto flex items-center">
              {lightAndDarkMode ? (
                <button className="dark:text-darkText text-lightText rounded-md   cursor-pointer">
                  <WbSunnyOutlinedIcon onClick={() => dispatch(setLightAndDarkMode())} />
                </button>
              ) : (
                <button className="dark:text-darkText text-lightText rounded-md   cursor-pointer">
                  <NightlightOutlinedIcon onClick={() => dispatch(setLightAndDarkMode())} />
                </button>
              )}

              <button onClick={handleClick} className="ml-4">
                <MenuIcon />
              </button>
            </div>
          )}

          {userId && (
            <div className="w-auto flex items-center ">
              <button className=" hover:underline cursor-pointer" onClick={handleClick}>
                Hi, {getFirstName(name)}
              </button>

              <button onClick={handleClick}>
                <AccountCircleIcon className="text-chartGreen dark:text-chartGreen/90 text-[24px]" />
              </button>

              {userId && (
                <div className="w-auto flex h-auto">
                  {lightAndDarkMode ? (
                    <button className="dark:text-darkText text-lightText rounded-md ml-2  cursor-pointer">
                      <WbSunnyOutlinedIcon onClick={() => dispatch(setLightAndDarkMode())} />
                    </button>
                  ) : (
                    <button className="dark:text-darkText text-lightText rounded-md ml-2  cursor-pointer">
                      <NightlightOutlinedIcon onClick={() => dispatch(setLightAndDarkMode())} />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        {!matches && (
          <MenuItem
            onClick={() => {
              navigate("/");
              handleClose();
            }}
          >
            Home
          </MenuItem>
        )}
        {!matches && (
          <MenuItem
            onClick={() => {
              navigate("/cars");
              handleClose();
            }}
          >
            Cars
          </MenuItem>
        )}
        {userId && (
          <MenuItem
            onClick={() => {
              dispatch(setLogout());
              navigate("/");
              handleClose();
            }}
          >
            Log Out
          </MenuItem>
        )}
        {!userId && (
          <MenuItem
            onClick={() => {
              navigate("/auth/signup");
              handleClose();
            }}
          >
            Sign Up
          </MenuItem>
        )}
        {!userId && (
          <MenuItem
            onClick={() => {
              navigate("/auth/login");
              handleClose();
            }}
          >
            Login
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}
