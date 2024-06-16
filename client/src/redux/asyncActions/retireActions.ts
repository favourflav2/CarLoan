import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddRetireGoalObj, add_Retire_Goal, delete_Retire_Goal, update_Retire_Goal, update_RetireTable_Title } from "../api/tablesApi";
import { RetirementGoals } from "../features/modalSlices/retirementSlice";

export const createRetireGoal = createAsyncThunk("createRetireGoal", async ({ data, creator }: AddRetireGoalObj, { rejectWithValue }) => {
    try {
      const res = await add_Retire_Goal({ data, creator });
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response.data.msg);
    }
  });
  
  export const deleteRetireGoal = createAsyncThunk("deleteRetireGoal", async (data:{type:"Retirement", id:string}, { rejectWithValue }) => {
    try {
      const res = await delete_Retire_Goal(data);
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