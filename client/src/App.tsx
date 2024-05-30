import React from "react";
import NavBar from "./components/navbar/NavBar";
import Home from "./pages/Home/Home";
import {  Route, Routes } from "react-router-dom";
import Prac from "./components/Prac";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ItemDetails from "./pages/itemDetails/ItemDetails";
import Cars from "./pages/ScrapeCarvanaPage/Cars";
import { Dispatch, UseSelector } from "./redux/store";
import "react-image-crop/dist/ReactCrop.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SignUp from "./pages/Auth/signup/SignUp";
import Login from "./pages/Auth/login/Login";
import { setUser } from "./redux/features/authSlice";

function App() {
  const user = JSON.parse(localStorage.getItem("profile") || '{}')
  const dispatch = Dispatch();
  const { lightAndDarkMode } = UseSelector((state) => state.app);

  React.useEffect(() => {
    if(Object.keys(user).length <= 0){
      dispatch(setUser(null))
    }else{
      dispatch(setUser(user));
    }
  }, [dispatch, user]);

  return (
    <div className={`w-full h-full ${lightAndDarkMode ? " bg-homeBg" : " bg-lightHomeBg"}`}>
      <>
        <ToastContainer />
        
          <NavBar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/path" element={<Prac />} />
          <Route path="/vehicle/:id" element={<ItemDetails />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/login" element={<Login />} />
        </Routes>
      </>
    </div>
  );
}

export default App;
