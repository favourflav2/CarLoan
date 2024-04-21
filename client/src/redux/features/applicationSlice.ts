import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RetirementGoalNoFormat, RetirementGoals } from "./modalSlices/retirementSlice";
import { CarObjWithFormattedData } from "./modalSlices/carModalSlice";
import { HouseObjWithFormattedData } from "./modalSlices/houseSlice";


export type goal = RetirementGoals | CarObjWithFormattedData | null | HouseObjWithFormattedData;

interface AppSlice {
  lightAndDarkMode: boolean;
  retireModal: boolean;
  carModal: boolean;
  houseModal:boolean;
  selectedGoal: RetirementGoals | CarObjWithFormattedData | null | HouseObjWithFormattedData;
  shrinkDashboardSidebar: boolean;
  shrinkRetirementInputs: boolean;
  showHaveExample: boolean;
  showNeedExample1: boolean;
  showNeedExample2: boolean;
}

const initialState: AppSlice = {
  lightAndDarkMode: false,
  retireModal: false,

  carModal: false,
  selectedGoal: null,
  shrinkDashboardSidebar: false,
  shrinkRetirementInputs: false,
  showHaveExample: true,
  showNeedExample1: true,
  showNeedExample2: true,
  houseModal:false
};

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setLightAndDarkMode: (state) => {
      state.lightAndDarkMode = !state.lightAndDarkMode;
    },
    setAnyTypeOfModal: (state, action: PayloadAction<{ type: "Car" | "Retirement" | "House"; value: boolean }>) => {
      const { type, value } = action.payload;
      switch (type) {
        case "Retirement":
          state.retireModal = value;
          break;
        case "Car":
          state.carModal = value;
          break;
        case "House":
          state.houseModal = value
        break;
        default:
          return;
      }
    },
   
    setSelectedGoal: (state, action) => {
      state.selectedGoal = action.payload;
    },
    setSelectedGoalAfterCreate: (state, action: PayloadAction<RetirementGoalNoFormat>) => {
      const { budget, preRate, type, postRate, inflation, monthlyContribution, id, savings, title, lifeExpectancy, currentAge, retireAge } = action.payload;
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
      state.selectedGoal = formattedData;
    },
    editSelectedGoal: (state, action: PayloadAction<{ goal: RetirementGoals | CarObjWithFormattedData }>) => {
      // This reducer updates the selected goal ... so when you change the number a user sees the update
      const { goal } = action.payload;

      if (!state.selectedGoal) {
        return;
      }

      switch (goal?.type) {
        case "Retirement":
          const objSel = state.selectedGoal;
          if (goal.type !== "Retirement" || objSel.type !== "Retirement") return;
          state.selectedGoal = goal;

          break;
        case "Car":
          if (goal.type !== "Car" || state.selectedGoal.type !== "Car") return;

          state.selectedGoal = goal;
          break;
        default:
          return;
      }
    },
    editSelectedGoalTitle: (state, action: PayloadAction<{ goal: goal; title: string; modal?: string }>) => {
      const { goal, title } = action.payload;

      if (!state.selectedGoal) {
        return;
      }

      switch (goal?.type) {
        case "Retirement":
          if (!state.selectedGoal) return;
          if (goal.type !== "Retirement" || state.selectedGoal?.type !== "Retirement") return;

          state.selectedGoal.title = title;

          break;
        case "Car":
          if (!state.selectedGoal) return;
          if (!action.payload.modal) return;
          if (goal.type !== "Car" || state.selectedGoal?.type !== "Car") return;

          state.selectedGoal.name = title;
          state.selectedGoal.modal = action.payload.modal;

          break;
        default:
          return;
      }
    },
    editSelectedGoalImg: (state, action: PayloadAction<{ goal: goal; img:string}>) => {
      const { goal, img } = action.payload;

      if (!state.selectedGoal) {
        return;
      }

      switch (goal?.type) {
        case "Retirement":
          break;
        case "Car":
          if (!state.selectedGoal) return;
          if (goal.type !== "Car" || state.selectedGoal?.type !== "Car") return;

          state.selectedGoal.img = img

          break;
        default:
          return;
      }
    },
    setShrinkDashboard: (state) => {
      state.shrinkDashboardSidebar = !state.shrinkDashboardSidebar;
    },
    setShowHaveExample: (state, action) => {
      switch (action.payload) {
        case 0:
          state.showHaveExample = !state.showHaveExample;
          break;
        case 1:
          state.showNeedExample1 = !state.showNeedExample1;
          break;
        case 2:
          state.showNeedExample2 = !state.showNeedExample2;
          break;
        default:
          return;
      }
    },
  },
});

export default appSlice.reducer;
export const {
  setLightAndDarkMode,
  setAnyTypeOfModal,
  setSelectedGoal,
  editSelectedGoal,
  editSelectedGoalTitle,
  setShrinkDashboard,
  setShowHaveExample,
  setSelectedGoalAfterCreate,
  editSelectedGoalImg
} = appSlice.actions;


