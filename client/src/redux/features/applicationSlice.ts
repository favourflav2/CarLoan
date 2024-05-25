import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RetirementGoalNoFormat, RetirementGoals } from "./modalSlices/retirementSlice";
import { CarObj, CarObjWithFormattedData } from "./modalSlices/carModalSlice";
import { HouseObj, HouseObjWithFormattedData } from "./modalSlices/houseSlice";

export type goal = RetirementGoals | CarObjWithFormattedData | null | HouseObjWithFormattedData;

interface AppSlice {
  lightAndDarkMode: boolean;
  retireModal: boolean;
  carModal: boolean;
  houseModal: boolean;
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
  houseModal: false,
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
          state.houseModal = value;
          break;
        default:
          return;
      }
    },

    setSelectedGoal: (state, action) => {
      state.selectedGoal = action.payload;
    },
    setSelectedGoalAfterCreate: (state, action: PayloadAction<RetirementGoalNoFormat | HouseObj | CarObj>) => {
      const { type } = action.payload;
      switch (type) {
        case "Retirement":
          if (type !== "Retirement") return;
          const { budget, preRate, postRate, inflation, monthlyContribution, savings, title, lifeExpectancy, currentAge, retireAge } = action.payload;
          const retireData: RetirementGoals = {
            id: action.payload.id,
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
            showInputs: true,
          };
          state.selectedGoal = retireData;
          break;
        case "Car":
          if (type !== "Car") return;
          const { name, mileage, salary, modal } = action.payload;
          const carData: CarObjWithFormattedData = {
            id: action.payload.id,
            name,
            price: parseFloat(action.payload.price.replace(/[,%$]/gm, "")),
            mileage: parseFloat(mileage.replace(/[,%$]/gm, "")),
            downPayment: parseFloat(action.payload.downPayment.replace(/[,%$]/gm, "")),
            interest: parseFloat(action.payload.interest.replace(/[,%$]/gm, "")),
            term: action.payload.term,
            salary: parseFloat(salary.replace(/[,%$]/gm, "")),
            img: action.payload.img ? action.payload.img : "",
            modal,
            type: "Car",
            extraPayment: 0,
            showInputs: true,
          };
          state.selectedGoal = carData;
          break;
        case "House":
          if (type !== "House") return;
          const { streetAddress, price, downPayment, interest, img, propertyTax, insurance, mortgageInsurance, appreciation, opportunityCostRate, maintenance, rent, showOppCostInputs } =
            action.payload;

          const houseData: HouseObjWithFormattedData = {
            id: action.payload.id,
            streetAddress,
            price: parseFloat(price.replace(/[,%$]/gm, "")),
            downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
            interest: parseFloat(interest.replace(/[,%$]/gm, "")),
            term: action.payload.term,
            extraPayment: 0,
            img: img ? img : "",
            propertyTax: parseFloat(propertyTax.replace(/[,%$]/gm, "")),
            insurance: parseFloat(insurance.replace(/[,%$]/gm, "")),
            mortgageInsurance: parseFloat(mortgageInsurance.replace(/[,%$]/gm, "")),
            appreciation: parseFloat(appreciation.replace(/[,%$]/gm, "")),
            opportunityCostRate: parseFloat(opportunityCostRate.replace(/[,%$]/gm, "")),
            maintenance: parseFloat(maintenance.replace(/[,%$]/gm, "")),
            rent: parseFloat(rent.replace(/[,%$]/gm, "")),
            type: "House",
            showTax: "monthlyPaymentWithNoTax",
            showInputs: true,
            showOppCostInputs,
          };

          state.selectedGoal = houseData;
          break;
        default:
          return;
      }
    },
    editSelectedGoal: (state, action: PayloadAction<{ goal: RetirementGoals | CarObjWithFormattedData | HouseObjWithFormattedData }>) => {
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

        case "House":
          if (goal.type !== "House" || state.selectedGoal.type !== "House") return;
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
        case "House":
          if (!state.selectedGoal) return;

          if (goal.type !== "House" || state.selectedGoal?.type !== "House") return;

          state.selectedGoal.streetAddress = title;

          break;
        default:
          return;
      }
    },
    editSelectedGoalImg: (state, action: PayloadAction<{ goal: goal; img: string }>) => {
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

          state.selectedGoal.img = img;

          break;
        case "House":
          if (!state.selectedGoal) return;
          if (goal.type !== "House" || state.selectedGoal?.type !== "House") return;
          state.selectedGoal.img = img;

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
    editShowTaxForHouse: (state, action: PayloadAction<HouseObjWithFormattedData>) => {
      if (!state.selectedGoal || action.payload.type !== "House" || state.selectedGoal.type !== "House") return;

      state.selectedGoal.showTax =
        state.selectedGoal.showTax === "monthlyPaymentWithTax" ? (state.selectedGoal.showTax = "monthlyPaymentWithNoTax") : (state.selectedGoal.showTax = "monthlyPaymentWithTax");
    },
    selectedShowInput: (state, action: PayloadAction<{ goal: goal; value: boolean }>) => {
      const { goal, value } = action.payload;
      switch (goal?.type) {
        case "Car":
          if (!state.selectedGoal || state.selectedGoal.type !== "Car") return;
          state.selectedGoal.showInputs = value;
          break;
        case "House":
          if (!state.selectedGoal || state.selectedGoal.type !== "House") return;
          state.selectedGoal.showInputs = value;
          break;
        case "Retirement":
          if (!state.selectedGoal || state.selectedGoal.type !== "Retirement") return;
          state.selectedGoal.showInputs = value;
          break;
        default:
          break;
      }
    },
    selectedShowOppCostInput: (state, action: PayloadAction<{ goal: goal; value: boolean }>) => {
      const { goal, value } = action.payload;
      switch (goal?.type) {
        case "Car":
          break;
        case "House":
          if (!state.selectedGoal || state.selectedGoal.type !== "House") return;
          state.selectedGoal.showOppCostInputs = value;
          break;
        case "Retirement":
          break;
        default:
          break;
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
  editSelectedGoalImg,
  editShowTaxForHouse,
  selectedShowInput,
  selectedShowOppCostInput,
} = appSlice.actions;
