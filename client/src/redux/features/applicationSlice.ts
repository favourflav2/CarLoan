import { createSlice } from "@reduxjs/toolkit";

interface AppSlice {
    lightAndDarkMode: boolean;
    retireModal: boolean;
    currentStepIndex: number,
    steps: number
}

const initialState: AppSlice = {
    lightAndDarkMode: false,
    retireModal:false,
    currentStepIndex:0,
    steps:0
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
     }
    },
   
  });

  export default appSlice.reducer
  export const {setLightAndDarkMode,
setRetireModal, setStepLength, setCurrentStepIndexRedux} = appSlice.actions