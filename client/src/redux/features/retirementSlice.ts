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
      const { age, budget, preRate, postRate, inflation, monthlyContribution, id, savings } = action.payload;
      const formattedData = {
        id,
        type:'retirement',
        age: age,
        budget: parseFloat(budget.replace(/[,%$]/gm, "")),
        preRate: parseFloat(preRate.replace(/[,%$]/gm, "")),
        postRate: parseFloat(postRate.replace(/[,%$]/gm, "")),
        inflation: parseFloat(inflation.replace(/[,%$]/gm, "")),
        monthlyContribution: parseFloat(monthlyContribution.replace(/[,%$]/gm, "")),
        savings: parseFloat(savings.replace(/[,%$]/gm, "")),
      };
     
      state.retireGoals = [...state.retireGoals, formattedData]
    },
  },
});

export default retirementSlice.reducer;
export const { addRetireGoal } = retirementSlice.actions;
