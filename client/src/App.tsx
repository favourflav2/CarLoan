import React from "react";
import NavBar from "./components/navbar/NavBar";
import Home from "./pages/Home/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import Prac from "./components/Prac";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ItemDetails from "./pages/itemDetails/ItemDetails";
import Cars from "./pages/ScrapeCarvanaPage/Cars";
import { Dispatch, UseSelector } from "./redux/store";
import "react-image-crop/dist/ReactCrop.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-lazy-load-image-component/src/effects/blur.css';
import SignUp from "./pages/Auth/signup/SignUp";
import Login from "./pages/Auth/login/Login";
import { setUser } from "./redux/features/authSlice";
import ForgotPassword from "./pages/Auth/forgotPassword/ForgotPassword";
import PleaseCheckEmail from "./pages/Auth/pleaseCheckEmail/PleaseCheckEmail";
import ResetPasswordPrivateRoute from "./pages/Auth/PrivateRoutes/ResetPasswordPrivateRoute";
import CreateNewPassword from "./pages/Auth/createNewPassword/CreateNewPassword";
import HowToInvest from "./pages/HowToPage/HowToInvest";

export function App() {
  const localStorageUser = localStorage.getItem("profile");
  const user = localStorageUser !== null ? JSON.parse(localStorageUser) : null;

  const dispatch = Dispatch();
  const { lightAndDarkMode } = UseSelector((state) => state.app);
  const { resetPasswordToken, checkEmailAndResetPasswordToken } = UseSelector((state) => state.auth);

  React.useEffect(() => {
    dispatch(setUser(user));
  }, []); // eslint-disable-line

  return (
    <div className={`w-full h-full ${lightAndDarkMode ? " bg-homeBg" : " bg-lightHomeBg"}`}>
      <>
        <ToastContainer />

        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home/howToInvest" element={<HowToInvest />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/path" element={<Prac />} />
          <Route path="/vehicle/:id" element={<ItemDetails />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgotPassword" element={<ForgotPassword />} />
          <Route
            path="/auth/checkEmail"
            element={
              <ResetPasswordPrivateRoute token={resetPasswordToken}>
                <PleaseCheckEmail />
              </ResetPasswordPrivateRoute>
            }
          />
          <Route
            path="/auth/resetPassword"
            element={
              <ResetPasswordPrivateRoute token={checkEmailAndResetPasswordToken}>
                <CreateNewPassword />
              </ResetPasswordPrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
    </div>
  );
}

export default App;
