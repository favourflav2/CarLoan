import React from 'react';
import NavBar from './components/navbar/NavBar';
import Home from './pages/Home/Home';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Prac from './components/Prac';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ItemDetails from './pages/itemDetails/ItemDetails';
import Cars from './pages/ScrapeCarvanaPage/Cars';
import { Dispatch, UseSelector } from './redux/store';
import 'react-image-crop/dist/ReactCrop.css'
import 'react-range-slider-input/dist/style.css';


function App() {
  const dispatch = Dispatch()
  const {lightAndDarkMode} = UseSelector(state => state.app)
  return (
    <div className={`w-full h-full ${lightAndDarkMode ? " bg-homeBg":" bg-lightHomeBg"}`}>
      <>
      <BrowserRouter>
      <ToastContainer />
       <NavBar /> 
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/cars" element={<Cars />} />
        <Route path="/path" element={<Prac />} />
        <Route path="/vehicle/:id" element={<ItemDetails />} />
      
      </Routes>
      
      </BrowserRouter>
      </>
    </div>
  );
}

export default App;
