import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HouseObj {
  id: string;
  streetAddress: string;
  price: string;
  downPayment: string;
  interest: string;
  term: number;
  extraPayment: string;
  img?: string;
  propertyTax: string;
  insurance: string;
  mortgageInsurance: string;
  appreciation: string;
  opportunityCostRate: string;
  maintenance: string;
}

export interface HouseObjWithFormattedData {
  id: string;
  streetAddress: string;
  price: number;
  downPayment: number;
  interest: number;
  term: number;
  extraPayment: number;
  img?: string;
  propertyTax: number;
  insurance: number;
  mortgageInsurance: number;
  appreciation: number;
  opportunityCostRate: number;
  maintenance: number;
  type: "House";
}

interface HouseData {
  houseGoals: Array<HouseObjWithFormattedData>;
  error: string;
  singleOrGridView: boolean;
}

const initialState: HouseData = {
  houseGoals: [],
  error: "",
  singleOrGridView: false,
};

const houseSlice = createSlice({
  name: "houseSlice",
  initialState,
  reducers: {
    addHouseGoal: (state, action: PayloadAction<HouseObj>) => {
      const {id, streetAddress, price, downPayment,interest, term, img, propertyTax, insurance, mortgageInsurance, appreciation, opportunityCostRate,maintenance } = action.payload;
      const formattedData: HouseObjWithFormattedData = {
        id,
        streetAddress,
        price: parseFloat(price.replace(/[,%$]/gm, "")),
        downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
        interest: parseFloat(interest.replace(/[,%$]/gm, "")),
        term,
        extraPayment: 0,
        img: img ? img : "",
        propertyTax: parseFloat(propertyTax.replace(/[,%$]/gm, "")),
        insurance: parseFloat(insurance.replace(/[,%$]/gm, "")),
        mortgageInsurance: parseFloat(mortgageInsurance.replace(/[,%$]/gm, "")),
        appreciation: parseFloat(appreciation.replace(/[,%$]/gm, "")),
        opportunityCostRate: parseFloat(opportunityCostRate.replace(/[,%$]/gm, "")),
        maintenance: parseFloat(maintenance.replace(/[,%$]/gm, "")),
        type: "House",
        
      };

      const index = state.houseGoals.findIndex((item) => item.id === id);

      if (index === -1) {
        state.houseGoals = [...state.houseGoals, formattedData];
      } else {
        state.error = "There is duplicate car items";
      }
    },
    removeHouseGoal: (state,action: PayloadAction<HouseObjWithFormattedData>) => {
        if(action.payload.type !== "House") return

        const {id, streetAddress} = action.payload

        state.houseGoals = state.houseGoals.filter(item => item.id !== id && item.streetAddress !== streetAddress)
    }
  },
});

export default houseSlice.reducer;

export const {addHouseGoal,removeHouseGoal} = houseSlice.actions;
