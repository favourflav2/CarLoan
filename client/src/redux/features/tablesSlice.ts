import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RetirementGoals } from "./modalSlices/retirementSlice";
import { CarObjWithFormattedData } from "./modalSlices/carModalSlice";
import { HouseObjWithFormattedData } from "./modalSlices/houseSlice";
import {toast} from 'react-toastify'
import { createHouseGoal, updateHouseGoal, deleteHouseGoal, updateHouseGoalImg, updateHouseGoalOppCost, updateHouseGoalAddress, hideAndShowHouseInputs, hideAndShowHouseOppCostInputs } from "../asyncActions/houseActions";
import { createRetireGoal, deleteRetireGoal, updateRetireGoal, updateRetireTableName } from "../asyncActions/retireActions";
import { get_All_Goals } from "../api/tablesApi";
import { createCarGoal, deleteCarGoal, updateCarGoal, updateCarGoalImg, updateCarName } from "../asyncActions/carActions";

interface UserGoalsObj {
  data: Array<RetirementGoals| CarObjWithFormattedData | HouseObjWithFormattedData>;
  page: number;
  limit: number;
  totalPages: number | null;
  totalCount: number | null;
}

interface TableObj {
  pageState: number;

  // All user goals
  userGoals: UserGoalsObj;
  userGoalsError: any;
  userGoalsLoading: boolean;

  userRetireGoals: Array<RetirementGoals>;
  userRetireGoalsError: any;
  userRetireGoalsLoading: boolean;


  userHouseGoals: Array<HouseObjWithFormattedData>;
  userHouseGoalsError: any;
  userHouseGoalsLoading: boolean;

  userCarGoals: Array<CarObjWithFormattedData>;
  userCarGoalsError: any;
  userCarGoalsIsLoading: boolean
}

const initialState: TableObj = {
  pageState: 1,
  userGoals: {
    data: [],
    page: 1,
    limit: 10,
    totalCount: null,
    totalPages: null,
  },
  userGoalsError: "",
  userGoalsLoading: false,

  userRetireGoals: [],
  userRetireGoalsError: "",
  userRetireGoalsLoading: false,

  userHouseGoals: [],
  userHouseGoalsError:"",
  userHouseGoalsLoading:false,

  userCarGoals:[],
  userCarGoalsError:"",
  userCarGoalsIsLoading: false
};


// All Goals
export const getAllGoals = createAsyncThunk("getAllGoals", async (data: { limit: number; page: number }, { rejectWithValue }) => {
  try {
    const res = await get_All_Goals(data);
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});









const tableSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    setPageState: (state, action: PayloadAction<number>) => {
      state.pageState = action.payload;
    },
    setUserGoalError: (state) => {
      state.userGoalsError = ""
    }
  },
  extraReducers(builder) {
    builder
      // Fetch All Goals
      .addCase(getAllGoals.pending, (state) => {
        state.userGoalsLoading = true;
      })
      .addCase(getAllGoals.fulfilled, (state, action: PayloadAction<UserGoalsObj>) => {
        state.userGoals = action.payload;
        state.userGoalsError = ""
        state.userGoalsLoading = false;
      })
      .addCase(getAllGoals.rejected, (state, action) => {
        state.userGoalsError = action.payload;
        state.userGoalsLoading = false;
      })

      // -------------------------------------- Retire Goals ------------------------------------------

      // Add retire goal
      .addCase(createRetireGoal.pending, (state) => {
        state.userRetireGoalsLoading = true;
      })
      .addCase(createRetireGoal.fulfilled, (state) => {
        state.userRetireGoalsError = ""
        state.userRetireGoalsLoading = false;
      })
      .addCase(createRetireGoal.rejected, (state, action) => {
        state.userRetireGoalsError = action.payload;
        state.userRetireGoalsLoading = false;
      })

       // Delete retire goal
       .addCase(deleteRetireGoal.pending, (state) => {
        state.userRetireGoalsLoading = true;
      })
      .addCase(deleteRetireGoal.fulfilled, (state) => {
        state.userRetireGoalsError = ""
        state.userRetireGoalsLoading = false;
      })
      .addCase(deleteRetireGoal.rejected, (state, action) => {
        state.userRetireGoalsError = action.payload;
        state.userRetireGoalsLoading = false;
      })

       // Update retire goal
       .addCase(updateRetireGoal.pending, (state) => {
        state.userRetireGoalsLoading = true;
      })
      .addCase(updateRetireGoal.fulfilled, (state, action:PayloadAction<string>) => {
        toast.success(action.payload)
        state.userRetireGoalsError = ""
        state.userRetireGoalsLoading = false;
      })
      .addCase(updateRetireGoal.rejected, (state, action) => {
        state.userRetireGoalsError = action.payload;
        state.userRetireGoalsLoading = false;
      })

      // Update retire title
      .addCase(updateRetireTableName.pending, (state) => {
        state.userRetireGoalsLoading = true;
      })
      .addCase(updateRetireTableName.fulfilled, (state, action:PayloadAction<string>) => {
        toast.success(action.payload)
        state.userHouseGoalsError = ""
        state.userRetireGoalsLoading = false;
      })
      .addCase(updateRetireTableName.rejected, (state, action) => {
        toast.error(action.payload as string)
        state.userHouseGoalsError = action.payload;
        state.userRetireGoalsLoading = false;
      })

      // ----------------------------------- House Goals ----------------------------------


      // Create House Goal
      .addCase(createHouseGoal.pending, (state) => {
        state.userHouseGoalsLoading = true;
      })
      .addCase(createHouseGoal.fulfilled, (state, action:PayloadAction<string>) => {
        //toast.success(action.payload)
        state.userHouseGoalsError = ''
        state.userHouseGoalsLoading = false;
      })
      .addCase(createHouseGoal.rejected, (state, action) => {
        toast.error(action.payload as string)
        state.userHouseGoalsError = action.payload
        state.userHouseGoalsLoading = false;
      })

      // Update House GOal
      .addCase(updateHouseGoal.pending, (state) => {
        state.userHouseGoalsLoading = true;
      })
      .addCase(updateHouseGoal.fulfilled, (state, action:PayloadAction<string>) => {
        state.userHouseGoalsError = ''
        state.userHouseGoalsLoading = false;
        toast.success(action.payload)
      })
      .addCase(updateHouseGoal.rejected, (state, action) => {
        toast.error(action.payload as string)
        state.userHouseGoalsError = action.payload
        state.userHouseGoalsLoading = false;
      })

      // Delete House Goal
      .addCase(deleteHouseGoal.pending, (state) => {
        state.userHouseGoalsLoading = true;
      })
      .addCase(deleteHouseGoal.fulfilled, (state, action:PayloadAction<string>) => {
        state.userHouseGoalsError = ''
        state.userHouseGoalsLoading = false;
        toast.success(action.payload)
      })
      .addCase(deleteHouseGoal.rejected, (state, action) => {
        toast.error(action.payload as string)
        state.userHouseGoalsError = action.payload
        state.userHouseGoalsLoading = false;
      })

      // Update House Opp Cost
      .addCase(updateHouseGoalOppCost.pending, (state) => {
        state.userHouseGoalsLoading = true;
      })
      .addCase(updateHouseGoalOppCost.fulfilled, (state, action:PayloadAction<string>) => {
        state.userHouseGoalsError = ''
        state.userHouseGoalsLoading = false;
        //toast.success(action.payload)
      })
      .addCase(updateHouseGoalOppCost.rejected, (state, action) => {
        toast.error(action.payload as string)
        state.userHouseGoalsError = action.payload
        state.userHouseGoalsLoading = false;
      })

      // Update House Goal Img
      .addCase(updateHouseGoalImg.pending, (state) => {
        state.userHouseGoalsLoading = true;
      })
      .addCase(updateHouseGoalImg.fulfilled, (state, action:PayloadAction<string>) => {
        state.userHouseGoalsError = ''
        state.userHouseGoalsLoading = false;
        //toast.success(action.payload)
      })
      .addCase(updateHouseGoalImg.rejected, (state, action) => {
        toast.error(action.payload as string)
        state.userHouseGoalsError = action.payload
        state.userHouseGoalsLoading = false;
      })

      // Update House Address
      .addCase(updateHouseGoalAddress.pending, (state) => {
        state.userHouseGoalsLoading = true;
      })
      .addCase(updateHouseGoalAddress.fulfilled, (state, action:PayloadAction<string>) => {
        state.userHouseGoalsError = ''
        state.userHouseGoalsLoading = false;
        //toast.success(action.payload)
      })
      .addCase(updateHouseGoalAddress.rejected, (state, action) => {
        toast.error(action.payload as string)
        state.userHouseGoalsError = action.payload
        state.userHouseGoalsLoading = false;
      })

      // Show and Hide Inputs House Goal
      .addCase(hideAndShowHouseInputs.pending, (state) => {
        state.userHouseGoalsLoading = true;
      })
      .addCase(hideAndShowHouseInputs.fulfilled, (state, action:PayloadAction<string>) => {
        state.userHouseGoalsError = ''
        state.userHouseGoalsLoading = false;
        //toast.success(action.payload)
      })
      .addCase(hideAndShowHouseInputs.rejected, (state, action) => {
        toast.error(action.payload as string)
        state.userHouseGoalsError = action.payload
        state.userHouseGoalsLoading = false;
      })

      // Show and hide opp Cost
      .addCase(hideAndShowHouseOppCostInputs.pending, (state) => {
        state.userHouseGoalsLoading = true;
      })
      .addCase(hideAndShowHouseOppCostInputs.fulfilled, (state, action:PayloadAction<string>) => {
        state.userHouseGoalsError = ''
        state.userHouseGoalsLoading = false;
        //toast.success(action.payload)
      })
      .addCase(hideAndShowHouseOppCostInputs.rejected, (state, action) => {
        toast.error(action.payload as string)
        state.userHouseGoalsError = action.payload
        state.userHouseGoalsLoading = false;
      })


      // ------------------------------------------ Car Goals --------------------------------------

      // Create Car Goal
      .addCase(createCarGoal.pending, (state) => {
        state.userCarGoalsIsLoading = true;
      })
      .addCase(createCarGoal.fulfilled, (state) => {
        state.userCarGoalsError = ''
        state.userCarGoalsIsLoading = false;
        
      })
      .addCase(createCarGoal.rejected, (state, action) => {
        toast.error(action.payload as string)
        state.userCarGoalsError = action.payload
        state.userCarGoalsIsLoading = false;
      })

      // Update Car Goal
      .addCase(updateCarGoal.pending, (state) => {
        state.userCarGoalsIsLoading = true;
      })
      .addCase(updateCarGoal.fulfilled, (state) => {
        state.userCarGoalsError = ''
        state.userCarGoalsIsLoading = false;
        
      })
      .addCase(updateCarGoal.rejected, (state, action) => {
        toast.error(action.payload as string)
        state.userCarGoalsError = action.payload
        state.userCarGoalsIsLoading = false;
      })

      // Update Car Name and Modal
      .addCase(updateCarName.pending, (state) => {
        state.userCarGoalsIsLoading = true;
      })
      .addCase(updateCarName.fulfilled, (state) => {
        state.userCarGoalsError = ''
        state.userCarGoalsIsLoading = false;
        
      })
      .addCase(updateCarName.rejected, (state, action) => {
        toast.error(action.payload as string)
        state.userCarGoalsError = action.payload
        state.userCarGoalsIsLoading = false;
      })

      // Delete Car Goal
      .addCase(deleteCarGoal.pending, (state) => {
        state.userCarGoalsIsLoading = true;
      })
      .addCase(deleteCarGoal.fulfilled, (state, action:PayloadAction<string>) => {
        state.userCarGoalsError = ''
        toast.success(action.payload)
        state.userCarGoalsIsLoading = false;
        
      })
      .addCase(deleteCarGoal.rejected, (state, action) => {
        toast.error(action.payload as string)
        state.userCarGoalsError = action.payload
        state.userCarGoalsIsLoading = false;
      })

      // Update Car Goal Img
      .addCase(updateCarGoalImg.pending, (state) => {
        state.userCarGoalsIsLoading = true;
      })
      .addCase(updateCarGoalImg.fulfilled, (state) => {
        state.userCarGoalsError = ''
        state.userCarGoalsIsLoading = false;
        
      })
      .addCase(updateCarGoalImg.rejected, (state, action) => {
        toast.error(action.payload as string)
        state.userCarGoalsError = action.payload
        state.userCarGoalsIsLoading = false;
      })




  },
});
export default tableSlice.reducer;
export const { setPageState, setUserGoalError } = tableSlice.actions;
