import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CarObj {
  id: string;
  name: string;
  price: string;
  mileage: string;
  downPayment: string;
  interest: string;
  term: number;
  salary: string;
  img?: string | undefined;
  modal: string;
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
  img?: string | undefined;
  modal: string;
  type:"Car";
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
      const { name, id, mileage, term, salary, interest, downPayment, img, price, modal } = action.payload;
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
        type:"Car"
      };

      const index = state.carGoals.findIndex((item) => item.id === id);

      if (index === -1) {
        state.carGoals = [...state.carGoals, formattedData];
      }else{
        state.error = "There is duplicate car items"
      }
    },
  },
});

export default carModalSlice.reducer;

export const { addCarGoal } = carModalSlice.actions;
