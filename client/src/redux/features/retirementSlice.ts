import { createSlice } from "@reduxjs/toolkit";

interface RetirementGoals {
  type: string;
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
  title:string;
}

interface RetirementSlice {
  retireGoals: Array<RetirementGoals>;
}

const initialState: RetirementSlice = {
  retireGoals: [],
};

const retirementSlice = createSlice({
  name: "retirementSlice",
  initialState,
  reducers: {
    addRetireGoal: (state, action) => {
      const { age, budget, preRate, postRate, inflation, monthlyContribution, id, savings, title } = action.payload;
      const formattedData = {
        id,
        type:'Retirement',
        age: age,
        budget: parseFloat(budget.replace(/[,%$]/gm, "")),
        preRate: parseFloat(preRate.replace(/[,%$]/gm, "")),
        postRate: parseFloat(postRate.replace(/[,%$]/gm, "")),
        inflation: parseFloat(inflation.replace(/[,%$]/gm, "")),
        monthlyContribution: parseFloat(monthlyContribution.replace(/[,%$]/gm, "")),
        savings: parseFloat(savings.replace(/[,%$]/gm, "")),
        title
      };
     
      state.retireGoals = [...state.retireGoals, formattedData]
    },
    removeRetireItem: (state,action) => {
        const {id,title} = action.payload

        state.retireGoals = state.retireGoals.filter(item => item.id !== id && item.title !== title)
    }
  },
});

export default retirementSlice.reducer;
export const { addRetireGoal, removeRetireItem } = retirementSlice.actions;
