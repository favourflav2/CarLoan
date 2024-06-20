import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddCarGoalObj, create_Car_Goal, delete_Car_Goal, update_Car_Goal, update_Car_Goal_Img, update_Car_Name } from "../api/tablesApi";
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

export const updateCarName = createAsyncThunk("updateCarName", async (data:{id:string, name:string, modal:string}, {rejectWithValue}) => {
    try{
        const res = await update_Car_Name(data)
        return res.data

    }catch(e:any){
        return rejectWithValue(e.response.data.msg);
    }
})

export const deleteCarGoal = createAsyncThunk("deleteCarGoal", async (data:{itemUUID:string, dateAsAWSId:string, img:string }, {rejectWithValue}) => {
    try{
        const res = await delete_Car_Goal(data)
        return res.data

    }catch(e:any){
        return rejectWithValue(e.response.data.msg);
    }
})

export const updateCarGoalImg = createAsyncThunk("updateCarGoalImg", async (data:{goal:CarObjWithFormattedData, id:string; img:string}, {rejectWithValue}) => {
    try{
        const res = await update_Car_Goal_Img(data)
        return res.data

    }catch(e:any){
        return rejectWithValue(e.response.data.msg);
    }
})