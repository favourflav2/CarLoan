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
  extraPayment: string;
  showInputs:boolean;
  type: "Car"
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
  extraPayment: number;
  showInputs:boolean;
}

interface CarData {
  carGoals: Array<CarObjWithFormattedData>;
  error: string;
  singleOrGridView: boolean;
}

const initialState: CarData = {
  carGoals: [],
  error: "",
  singleOrGridView:false,
};

const carModalSlice = createSlice({
  name: "carSlice",
  initialState,
  reducers: {
    addCarGoal: (state, action: PayloadAction<CarObj>) => {
      const { name, id, mileage, term, salary, interest, downPayment, img, price, modal,showInputs } = action.payload;
      const formattedData:CarObjWithFormattedData = {
        id,
        name,
        price: parseFloat(price.replace(/[,%$]/gm, "")),
        mileage: parseFloat(mileage.replace(/[,%$]/gm, "")),
        downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
        interest: parseFloat(interest.replace(/[,%$]/gm, "")),
        term,
        salary: parseFloat(salary.replace(/[,%$]/gm, "")),
        img: img ? img : "",
        modal,
        type:"Car",
        extraPayment:0,
        showInputs
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
    },
    setSingleOrGridView: (state) => {
      state.singleOrGridView = !state.singleOrGridView
    },
    editCarGoalTitle: (state,action:PayloadAction<{id:string, goal:CarObjWithFormattedData, name:string, modal:string}>) => {
      const {id,goal,modal,name} = action.payload
      
      if(goal.type !== "Car") return

      const res = state.carGoals.map(val => {
        if(val.id === id){
          return {
            ...val,
            modal:modal,
            name:name
          }
        }else{
          return val
        }
      })

      state.carGoals = res

    },
    editCarGoalImg: (state,action:PayloadAction<{id:string, goal:CarObjWithFormattedData, img:string}>) => {
      const {id,goal,img} = action.payload
      
      if(goal.type !== "Car") return

      const res = state.carGoals.map(val => {
        if(val.id === id){
          return {
            ...val,
            img:img
          }
        }else{
          return val
        }
      })

      state.carGoals = res

    },
    carShowInput: (state,action:PayloadAction<{id:string, value:boolean}>) => {
      const {id,value} = action.payload
      const index = state.carGoals.findIndex(item => item.id === id)

      if(index >= 0){
        state.carGoals[index].showInputs = value
      }
    },
    setCarGoals: (state) => {
      state.carGoals = []
    }
  },
});

export default carModalSlice.reducer;

export const { addCarGoal, removeCarItem, editCarGoal, setSingleOrGridView, editCarGoalTitle,editCarGoalImg, carShowInput, setCarGoals } = carModalSlice.actions;
