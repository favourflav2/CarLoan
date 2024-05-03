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
  showInputs:boolean;
  rent:string;
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
  showTax:"monthlyPaymentWithTax" | "monthlyPaymentWithNoTax";
  showInputs:boolean;
  rent:number
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
      const {id, streetAddress, price, downPayment,interest, term, img, propertyTax, insurance, mortgageInsurance, appreciation, opportunityCostRate,maintenance, showInputs, rent } = action.payload;
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
        rent: parseFloat(rent.replace(/[,%$]/gm, "")),
        type: "House",
        showTax:"monthlyPaymentWithNoTax",
        showInputs
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

        const {id} = action.payload

        //console.log(id)

        state.houseGoals = state.houseGoals.filter(item => item.id !== id)
    },
    updateShowTax: (state,action: PayloadAction<{id:string}>) => {
      const {id} = action.payload

      const index = state.houseGoals.findIndex(item => item.id === id)

      if(index >= 0){
        state.houseGoals[index].showTax = state.houseGoals[index].showTax === "monthlyPaymentWithTax" ? state.houseGoals[index].showTax = "monthlyPaymentWithNoTax" : state.houseGoals[index].showTax = "monthlyPaymentWithTax"
      }
    },
    editHouseGoal: (state, action: PayloadAction<{id:string, goal: HouseObjWithFormattedData}>) => {
      const {id, goal} = action.payload

      const index = state.houseGoals.findIndex(item => item.id === id)

      if(index >= 0){
        state.houseGoals[index] = goal
      }
    },
    editHouseGoalImg: (state,action:PayloadAction<{id:string, goal:HouseObjWithFormattedData, img:string}>) => {
      const {id,goal,img} = action.payload
      
      if(goal.type !== "House") return

      const res = state.houseGoals.map(val => {
        if(val.id === id){
          return {
            ...val,
            img:img
          }
        }else{
          return val
        }
      })

      state.houseGoals = res

    },
    editHouseGoalTitle: (state,action:PayloadAction<{id:string, goal:HouseObjWithFormattedData, newAddress:string}>) => {
      const {id,goal,newAddress} = action.payload
      
      if(goal.type !== "House") return

      const res = state.houseGoals.map(val => {
        if(val.id === id){
          return {
            ...val,
            streetAddress:newAddress
          }
        }else{
          return val
        }
      })

      state.houseGoals = res

    },
    houseShowInput: (state,action:PayloadAction<{id:string, value:boolean}>) => {
      const {id,value} = action.payload
      const index = state.houseGoals.findIndex(item => item.id === id)

      if(index >= 0){
        state.houseGoals[index].showInputs = value
      }
    },
  },
});

export default houseSlice.reducer;

export const {addHouseGoal,removeHouseGoal,updateShowTax,editHouseGoal, houseShowInput, editHouseGoalImg, editHouseGoalTitle} = houseSlice.actions;
