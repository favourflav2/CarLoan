import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RetirementGoals } from "./modalSlices/retirementSlice";
import { CarObjWithFormattedData } from "./modalSlices/carModalSlice";
import { HouseObjWithFormattedData } from "./modalSlices/houseSlice";
import { get_All_Goals } from "../api/tablesApi";

interface UserGoalsObj {
    data:Array<RetirementGoals | CarObjWithFormattedData | HouseObjWithFormattedData>;
    page:number
    limit:number
    totalPages:number | null
    totalCount:number | null
}

interface TableObj {
    pageState: number

    // All user goals
    userGoals: UserGoalsObj
    userGoalsError:any;
    userGoalsLoading: boolean

    userRetireGoals:Array<RetirementGoals>;
    userRetireGoalsError:any;
    userRetireGoalsLoading:boolean
    
}

const initialState: TableObj = {
    pageState:1,
    userGoals:{
        data:[],
        page:1,
        limit:10,
        totalCount:null,
        totalPages:null
    },
    userGoalsError:"",
    userGoalsLoading:false,

    userRetireGoals:[],
    userRetireGoalsError:"",
    userRetireGoalsLoading:false
  };

  export const getAllGoals = createAsyncThunk("getAllGoals", async(data:{limit:number,page:number}, { rejectWithValue}) => {
    try{
        const res = await get_All_Goals(data)
        return res.data

    }catch(e:any){
        return rejectWithValue(e.response.data.msg);
    }
  })

  const tableSlice = createSlice({
    name:"tables",
    initialState,
    reducers:{
        setPageState: (state, action:PayloadAction<number>) => {
            state.pageState = action.payload
        }
    },
    extraReducers(builder) {
        builder
        // Fetch All Goals
      .addCase(getAllGoals.pending, (state) => {
        state.userGoalsLoading = true;
      })
      .addCase(getAllGoals.fulfilled, (state, action:PayloadAction<UserGoalsObj>) => {
        state.userGoals = action.payload;
        state.userGoalsLoading = false;
      })
      .addCase(getAllGoals.rejected, (state, action) => {
        state.userGoalsError = action.payload;
        state.userGoalsLoading = false;
      })
    },
  })
  export default tableSlice.reducer
  export const {setPageState} = tableSlice.actions