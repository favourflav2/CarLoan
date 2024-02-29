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

interface AppSlice {
    lightAndDarkMode: boolean;
    retireModal: boolean;
    currentStepIndex: number,
    steps: number;
    selectedGoal: RetirementGoals | null
}

const initialState: AppSlice = {
    lightAndDarkMode: false,
    retireModal:false,
    currentStepIndex:0,
    steps:0,
    selectedGoal:null
}

const appSlice = createSlice({
    name: "appSlice",
    initialState,
    reducers: {
     setLightAndDarkMode: (state) => {
        state.lightAndDarkMode = !state.lightAndDarkMode
     },
     setRetireModal: (state,action) => {
        state.retireModal = action.payload
     },
     setCurrentStepIndexRedux: (state, action) => {
        if(action.payload === "next"){
            if(state.currentStepIndex < state.steps){
                state.currentStepIndex = state.currentStepIndex + 1
            }
        }else{
            if(state.currentStepIndex > 0){
                state.currentStepIndex = state.currentStepIndex - 1
            }
        }
     },
     setStepLength: (state,action) => {
        state.steps = action.payload
     },
     setSelectedGoal: (state,action) => {
        state.selectedGoal = action.payload
     }
    },
   
  });

  export default appSlice.reducer
  export const {setLightAndDarkMode,
setRetireModal, setStepLength, setCurrentStepIndexRedux, setSelectedGoal} = appSlice.actions