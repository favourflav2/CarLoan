import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { goal } from "../applicationSlice";

//! Need to add a check to make sure theres no item in array that matches id ... checking for dupilcates before I push into array

export interface RetirementGoals {
  type: "Retirement";
  id: string;
  currentAge: number;
  retireAge: number;
  lifeExpectancy: number;
  savings: number;
  monthlyContribution: number;
  budget: number;
  preRate: number;
  postRate: number;
  inflation: number;
  title: string;
}

export interface RetirementGoalNoFormat {
  type: "Retirement";
  id: string;
  currentAge: number;
  retireAge: number;
  lifeExpectancy: number;
  savings: string;
  monthlyContribution: string;
  budget: string;
  preRate: string;
  postRate: string;
  inflation: string;
  title: string;
}

interface InputRetireErrors {
  [key: string]: any;
}

interface RetirementSlice {
  retireGoals: Array<RetirementGoals>;
  errors: InputRetireErrors | null;
}

const initialState: RetirementSlice = {
  retireGoals: [],
  errors: null,
};

const retirementSlice = createSlice({
  name: "retirementSlice",
  initialState,
  reducers: {
    addRetireGoal: (state, action:PayloadAction<RetirementGoalNoFormat>) => {
      const { currentAge, lifeExpectancy, type, retireAge, budget, preRate, postRate, inflation, monthlyContribution, id, savings, title } = action.payload;
      const formattedData: RetirementGoals = {
        id,
        type,
        currentAge, 
        retireAge,
        lifeExpectancy,
        budget: parseFloat(budget.replace(/[,%$]/gm, "")),
        preRate: parseFloat(preRate.replace(/[,%$]/gm, "")),
        postRate: parseFloat(postRate.replace(/[,%$]/gm, "")),
        inflation: parseFloat(inflation.replace(/[,%$]/gm, "")),
        monthlyContribution: parseFloat(monthlyContribution.replace(/[,%$]/gm, "")),
        savings: parseFloat(savings.replace(/[,%$]/gm, "")),
        title,
      };

      state.retireGoals = [...state.retireGoals, formattedData];
    },
    removeRetireItem: (state, action) => {
      const { id, title } = action.payload;

      state.retireGoals = state.retireGoals.filter((item) => item.id !== id && item.title !== title);
    },
    editRetireGoal: (state, action:PayloadAction<{id:string, title:string, goal:RetirementGoals}>) => {
      // This reducer updates the retirment goal in the array
      const { id, title, goal } = action.payload;
      const index = state.retireGoals.findIndex(val => val.id === id && val.title === title)
      
      if(index >= 0){
        state.retireGoals[index] = goal
      }

    },
    editRetireGoalTitle: (state, action:PayloadAction<{goal:goal,newTitle:string,id:string | undefined}>) => {
      const { goal, id, newTitle } = action.payload;

      if(goal?.type !== "Retirement" || !goal || id === undefined) return
      
      const res = state.retireGoals.map(val => {
        if(val.id === id){
          return {
            ...val,
            title: newTitle
          }
        }else{
          return val
        }
      })

      state.retireGoals = res
    },
  },
});

export default retirementSlice.reducer;
export const { addRetireGoal, removeRetireItem, editRetireGoal, editRetireGoalTitle } = retirementSlice.actions;
