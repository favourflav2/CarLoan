import {  createSlice } from "@reduxjs/toolkit";

//! Need to add a check to make sure theres no item in array that matches id ... checking for dupilcates before I push into array

export interface RetirementGoals {
  type: "Retirement";
  id: string;
  age: {
    currentAge: number;
    retireAge: number;
    lifeExpectancy: number;
  };
  savings: number;
  monthlyContribution: number;
  budget: number;
  preRate: number;
  postRate: number;
  inflation: number;
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
    addRetireGoal: (state, action) => {
      const { age, budget, preRate, postRate, inflation, monthlyContribution, id, savings, title } = action.payload;
      const formattedData:RetirementGoals = {
        id,
        type: "Retirement",
        age: age,
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
    editRetireGoal: (state, action) => {
      // This reducer updates the retirment goal in the array
      const { id, title, name, value } = action.payload;

      const copyData = state.retireGoals.map((val) => {
        if (val.id === id && val.title === title) {
          if (name === "age.currentAge") {
            return {
              ...val,
              age: {
                ...val.age,
                currentAge: Number(value),
              },
            };
          } else if (name === "age.retireAge") {
            return {
              ...val,
              age: {
                ...val.age,
                retireAge: Number(value),
              },
            };
          } else if (name === "age.lifeExpectancy") {
            return {
              ...val,
              age: {
                ...val.age,
                lifeExpectancy: Number(value),
              },
            };
          } else {
            return {
              ...val,
              [name]: Number(value),
            };
          }
        } else {
          return val;
        }
      });

      state.retireGoals = copyData;
      
    },
    editRetireGoalTitle: (state,action) => {
      const { value, id,} = action.payload
      const copyData = state.retireGoals.map((item) => {
        if(item.id === id){
          return {
            ...item,
            title: value
          }
        }else{
          return item
        }
      })

      state.retireGoals = copyData
    },
    
  },
});

export default retirementSlice.reducer;
export const { addRetireGoal, removeRetireItem, editRetireGoal,editRetireGoalTitle } = retirementSlice.actions;
