import {  createSlice } from "@reduxjs/toolkit";

interface CarData {
    id:string;
    name:string;
    price:string;
    mileage:string;
    downPayment:string;
    interstRate:string;
    term:number;
    income:string;
}