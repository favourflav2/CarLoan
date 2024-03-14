import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
  title: string;
}

interface AppSlice {
  lightAndDarkMode: boolean;
  retireModal: boolean;
  currentStepIndex: number;
  steps: number;
  selectedGoal: RetirementGoals | null;
  shrinkDashboardSidebar:boolean;
  shrinkRetirementInputs: boolean;
  showHaveExample:boolean;
}

const initialState: AppSlice = {
  lightAndDarkMode: false,
  retireModal: false,
  currentStepIndex: 0,
  steps: 0,
  selectedGoal: null,
  shrinkDashboardSidebar:false,
  shrinkRetirementInputs:false,
  showHaveExample:true,
};

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setLightAndDarkMode: (state) => {
      state.lightAndDarkMode = !state.lightAndDarkMode;
    },
    setRetireModal: (state, action) => {
      state.retireModal = action.payload;
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
    setShowHaveExample: (state) => {
      state.showHaveExample = !state.showHaveExample
    }
  },
});

export default appSlice.reducer;
export const { setLightAndDarkMode, setRetireModal, setStepLength, setCurrentStepIndexRedux, setSelectedGoal, editSelectedGoal, editSelectedGoalTitle, setShrinkDashboard, setShowHaveExample } = appSlice.actions;
