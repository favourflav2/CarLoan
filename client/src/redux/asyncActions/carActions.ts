import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddCarGoalObj, create_Car_Goal, update_Car_Goal } from "../api/tablesApi";
import { CarObjWithFormattedData } from "../features/modalSlices/carModalSlice";

export const createCarGoal = createAsyncThunk("createCarGoal", async (data:AddCarGoalObj, {rejectWithValue}) => {
    try{
        const res = await create_Car_Goal(data)
        return res.data

    }catch(e:any){
        return rejectWithValue(e.response.data.msg);
    }
})

export const updateCarGoal = createAsyncThunk("updateCarGoal", async (data:{id:string, goal:CarObjWithFormattedData}, {rejectWithValue}) => {
    try{
        const res = await update_Car_Goal(data)
        return res.data

    }catch(e:any){
        return rejectWithValue(e.response.data.msg);
    }
})