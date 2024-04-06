import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RetirementGoals } from "./retirementSlice";

export interface CarObj {
  id: string;
  name: string;
  price: string;
  mileage: string;
  downPayment: string;
  interest: string;
  term: number;
  salary: string;
  img?:  string | undefined;
  modal: string;
  extraDownPayment:string
}

export interface CarObjWithFormattedData {
  id: string;
  name: string;
  price: number;
  mileage: number;
  downPayment: number;
  interest: number;
  term: number;
  salary: number;
  img?:  string | undefined;
  modal: string;
  type:"Car";
  extraDownPayment:number
}

interface CarData {
  carGoals: Array<CarObjWithFormattedData>;
  error: string;
}

const initialState: CarData = {
  carGoals: [],
  error: "",
};

const carModalSlice = createSlice({
  name: "carSlice",
  initialState,
  reducers: {
    addCarGoal: (state, action: PayloadAction<CarObj>) => {
      const { name, id, mileage, term, salary, interest, downPayment, img, price, modal, extraDownPayment } = action.payload;
      const formattedData:CarObjWithFormattedData = {
        id,
        name,
        price: parseFloat(price.replace(/[,%$]/gm, "")),
        mileage: parseFloat(mileage.replace(/[,%$]/gm, "")),
        downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
        interest: parseFloat(interest.replace(/[,%$]/gm, "")),
        term,
        salary: parseFloat(salary.replace(/[,%$]/gm, "")),
        img: img ? img : undefined,
        modal,
        type:"Car",
        extraDownPayment:parseFloat(extraDownPayment.replace(/[,%$]/gm, "")),
      };

      const index = state.carGoals.findIndex((item) => item.id === id);

      if (index === -1) {
        state.carGoals = [...state.carGoals, formattedData];
      }else{
        state.error = "There is duplicate car items"
      }
    },
    removeCarItem: (state, action:PayloadAction<RetirementGoals | CarObjWithFormattedData>) => {
      if(action.payload.type !== "Car") return
      const {id,name} = action.payload

      state.carGoals = state.carGoals.filter(val => val.id !== id && val.name !== name)
    },
    editCarGoal: (state,action:PayloadAction<{id:string,
    goal:CarObjWithFormattedData}>) => {
      const {id, goal} = action.payload

      const index = state.carGoals.findIndex(val => val.id === id)

      if(index >= 0){
        state.carGoals[index] = goal
      }
    }
  },
});

export default carModalSlice.reducer;

export const { addCarGoal, removeCarItem, editCarGoal } = carModalSlice.actions;
