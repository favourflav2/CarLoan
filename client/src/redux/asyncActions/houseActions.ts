import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddHouseGoalObj, create_House_Goal, update_House_Goal, delete_House_Goal, update_House_Goal_Opp_Cost, update_House_Goal_Img, update_House_Goal_Address, hide_And_Show_House_Inputs } from "../api/tablesApi";
import {  HouseObjWithFormattedData } from "../features/modalSlices/houseSlice";

export const createHouseGoal = createAsyncThunk("createHouseGoal", async ({data,creator}:AddHouseGoalObj, {rejectWithValue}) => {
    try{
      const res = await create_House_Goal({data,creator})
      return res.data
    }catch(e:any){
      return rejectWithValue(e.response.data.msg);
    }
  })
  
  export const updateHouseGoal = createAsyncThunk("updateHouseGoal", async (data: { type: "House"; id: string; inputData: HouseObjWithFormattedData }, {rejectWithValue}) => {
    try{
      const res = await update_House_Goal(data)
      return res.data
    }catch(e:any){
      return rejectWithValue(e.response.data.msg);
    }
  })
  
  export const deleteHouseGoal = createAsyncThunk("deleteHouseGoal", async (data:{itemUUID:string, dateAsAWSId:string, img:string;}, {rejectWithValue}) => {
    try{
      const res = await delete_House_Goal(data)
      return res.data
    }catch(e:any){
      return rejectWithValue(e.response.data.msg);
    }
  })
  
  export const updateHouseGoalOppCost = createAsyncThunk("updateHouseGoalOppCost", async (data:{creator:string, goal:HouseObjWithFormattedData, id:string;}, {rejectWithValue}) => {
    try{
      const res = await update_House_Goal_Opp_Cost(data)
      return res.data
    }catch(e:any){
      return rejectWithValue(e.response.data.msg);
    }
  })
  
  export const updateHouseGoalImg = createAsyncThunk("updateHouseGoalImg", async (data:{goal:HouseObjWithFormattedData, id:string, img:string}, {rejectWithValue}) => {
    try{
      const res = await update_House_Goal_Img(data)
      return res.data
    }catch(e:any){
      return rejectWithValue(e.response.data.msg);
    }
  })


  export const updateHouseGoalAddress = createAsyncThunk("updateHouseGoalAddress", async (data:{newAddress:string, id:string}, {rejectWithValue}) => {
    try{
      const res = await update_House_Goal_Address(data)
      return res.data
    }catch(e:any){
      return rejectWithValue(e.response.data.msg);
    }
  })

  export const hideAndShowHouseInputs = createAsyncThunk("hideAndShowHouseInputs", async (data:{id:string, inputs:boolean}, {rejectWithValue}) => {
    try{
      const res = await hide_And_Show_House_Inputs(data)
      return res.data
    }catch(e:any){
      return rejectWithValue(e.response.data.msg);
    }
  })

