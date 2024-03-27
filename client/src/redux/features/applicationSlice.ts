import {  createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CarObjWithFormattedData {
  type:"Car";
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
}

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
type goal = RetirementGoals | CarObjWithFormattedData | null





interface AppSlice {
  lightAndDarkMode: boolean;
  retireModal: boolean;
  carModal: boolean;
  currentStepIndex: number;
  steps: number;
  selectedGoal: RetirementGoals | null
  shrinkDashboardSidebar:boolean;
  shrinkRetirementInputs: boolean;
  showHaveExample:boolean;
  showNeedExample1:boolean;
  showNeedExample2:boolean;
  
}

const initialState: AppSlice = {
  lightAndDarkMode: false,
  retireModal: false,
  currentStepIndex: 0,
  steps: 0,
  carModal: false,
  selectedGoal: null,
  shrinkDashboardSidebar:false,
  shrinkRetirementInputs:false,
  showHaveExample:true,
  showNeedExample1:true,
  showNeedExample2:true,
 
};

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setLightAndDarkMode: (state) => {
      state.lightAndDarkMode = !state.lightAndDarkMode;
    },
    setAnyTypeOfModal: (state, action) => {
      const {type, value} = action.payload
      switch (type) {
        case "Retirement":
          state.retireModal = value
          break;
        case "Car":
          state.carModal = value
          break;
        default:
          return
      }
    },
    setCurrentStepIndexRedux: (state, action) => {
      if (action.payload === "next") {
        if (state.currentStepIndex < state.steps) {
          state.currentStepIndex = state.currentStepIndex + 1;
        }
      } else {
        if (state.currentStepIndex > 0) {
          state.currentStepIndex = state.currentStepIndex - 1;
        }
      }
    },
    setStepLength: (state, action) => {
      state.steps = action.payload;
    },
    setSelectedGoal: (state, action) => {
      state.selectedGoal = action.payload;
      console.log("where")
    },
    setSelectedGoalAfterCreate: (state, action) => {
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
      }
      state.selectedGoal = formattedData
    },
    editSelectedGoal: (state, action) => {
      // This reducer updates the selected goal ... so when you change the number a user sees the update
      const { goal, value, name } = action.payload;

      if (!state.selectedGoal) {
        return;
      }

     
        switch (goal.type) {
          case "Retirement":
            if (name === "age.currentAge") {
              // If what we type is a value we add it to state ... added this because typing backspace was causing problems
              if (value) {
                state.selectedGoal.age.currentAge = Number(value);
              }
            } else if (name === "age.retireAge") {
              if (value) {
                state.selectedGoal.age.retireAge = Number(value);
              }
            } else if (name === "age.lifeExpectancy") {
              if (value) {
                state.selectedGoal.age.lifeExpectancy = Number(value);
              }
            } else {
              if (value) {
                (state.selectedGoal[name as keyof RetirementGoals] as number) = Number(value);
              }
            }
            break;
          default:
            return
        }
      
    },
    editSelectedGoalTitle: (state,action) => {
      const { goal, value} = action.payload;
      if (!state.selectedGoal) {
        return;
      }

      switch (goal.type) {
        case "Retirement":
          state.selectedGoal.title = value
          break;
        default:
          return
      }
    },
    setShrinkDashboard: (state) => {
      state.shrinkDashboardSidebar = !state.shrinkDashboardSidebar
    },
    setShowHaveExample: (state,action) => {
      
      switch(action.payload){
        case 0:
          state.showHaveExample = !state.showHaveExample
          break;
        case 1:
          state.showNeedExample1 = !state.showNeedExample1
          break;
        case 2: 
          state.showNeedExample2 = !state.showNeedExample2
          break;
          default:
            return
      }
    },
   
  },
});

export default appSlice.reducer;
export const { setLightAndDarkMode, setAnyTypeOfModal, setStepLength, setCurrentStepIndexRedux, setSelectedGoal, editSelectedGoal, editSelectedGoalTitle, setShrinkDashboard, setShowHaveExample, setSelectedGoalAfterCreate } = appSlice.actions;


// switch (goal?.type) {
//   case "Retirement":
//     if (name === "age.currentAge") {
//       // If what we type is a value we add it to state ... added this because typing backspace was causing problems
//       if (value) {
//         state.selectedGoal.age.currentAge = Number(value);
//       }
//     } else if (name === "age.retireAge") {
//       if (value) {
//         state.selectedGoal.age.retireAge = Number(value);
//       }
//     } else if (name === "age.lifeExpectancy") {
//       if (value) {
//         state.selectedGoal.age.lifeExpectancy = Number(value);
//       }
//     } else {
//       if (value) {
//         (state.selectedGoal[name as keyof RetirementGoals] as number) = Number(value);
//       }
//     }
//     break;
//   default:
//     return
// }