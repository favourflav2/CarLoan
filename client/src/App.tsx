import React from 'react';
import NavBar from './components/navbar/NavBar';
import Home from './pages/Home/Home';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Prac from './components/Prac';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ItemDetails from './pages/itemDetails/ItemDetails';


function App() {
  return (
    <div className='w-full h-full'>
      <>
      <BrowserRouter>
      <ToastContainer />
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/cars"/>}/>
        <Route path="/cars" element={<Home />} />
        <Route path="/path" element={<Prac />} />
        <Route path="/vehicle/:id" element={<ItemDetails />} />
      
      </Routes>
      
      </BrowserRouter>
      </>
    </div>
  );
}

export default App;
