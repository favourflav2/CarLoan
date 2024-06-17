import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddCarGoalObj, create_Car_Goal } from "../api/tablesApi";

export const createCarGoal = createAsyncThunk("createCarGoal", async (data:AddCarGoalObj, {rejectWithValue}) => {
    try{
        const res = await create_Car_Goal(data)
        return res.data

    }catch(e:any){
        return rejectWithValue(e.response.data.msg);
    }
})