import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RetirementGoals } from "./modalSlices/retirementSlice";
import { CarObjWithFormattedData } from "./modalSlices/carModalSlice";
import { HouseObjWithFormattedData } from "./modalSlices/houseSlice";
import { AddRetireGoalObj, add_Retire_Goal, delete_A_Goal, get_All_Goals, update_RetireTable_Title, update_Retire_Goal } from "../api/tablesApi";
import {toast} from 'react-toastify'

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
};

export const getAllGoals = createAsyncThunk("getAllGoals", async (data: { limit: number; page: number }, { rejectWithValue }) => {
  try {
    const res = await get_All_Goals(data);
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});

export const createRetireGoal = createAsyncThunk("createRetireGoal", async ({ data, creator }: AddRetireGoalObj, { rejectWithValue }) => {
  try {
    const res = await add_Retire_Goal({ data, creator });
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});

export const deleteRetireGoal = createAsyncThunk("deleteRetireGoal", async (data:{type:"Retirement" | "House" | "Car", id:string}, { rejectWithValue }) => {
  try {
    const res = await delete_A_Goal(data);
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});

export const updateRetireGoal = createAsyncThunk("updateRetireGoal", async (data:{type:"Retirement" | "House" | "Car", id:string, inputData:RetirementGoals}, { rejectWithValue }) => {
  try {
    const res = await update_Retire_Goal(data);
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});

export const updateRetireTableName = createAsyncThunk("updateRetireTableName", async (data:{title:string, id:string | undefined}, {rejectWithValue}) => {
  try{
    const res = await update_RetireTable_Title(data)
    return res.data
  }catch(e:any){
    return rejectWithValue(e.response.data.msg);
  }
})

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
        state.userGoalsLoading = false;
      })
      .addCase(getAllGoals.rejected, (state, action) => {
        state.userGoalsError = action.payload;
        state.userGoalsLoading = false;
      })

      // Add retire goal
      .addCase(createRetireGoal.pending, (state) => {
        state.userRetireGoalsLoading = true;
      })
      .addCase(createRetireGoal.fulfilled, (state) => {
        state.userRetireGoalsError = false
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
        state.userRetireGoalsError = false
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
        state.userRetireGoalsError = false
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
        state.userRetireGoalsError = false
        state.userRetireGoalsLoading = false;
      })
      .addCase(updateRetireTableName.rejected, (state, action) => {
        toast.error(action.payload as string)
        state.userRetireGoalsError = action.payload;
        state.userRetireGoalsLoading = false;
      })


  },
});
export default tableSlice.reducer;
export const { setPageState, setUserGoalError } = tableSlice.actions;
