import axios from "axios";
import { RetirementGoals } from "../features/modalSlices/retirementSlice";
import { HouseObjWithFormattedData } from "../features/modalSlices/houseSlice";
export interface AddRetireGoalObj {
    creator:string;
    data:RetirementGoals
}

export interface AddHouseGoalObj {
    creator:string;
    data:HouseObjWithFormattedData
}

const API = axios.create({ baseURL: "http://localhost:5001" });

API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')){
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile") || '{}').token}`
    }
    return req
})

// Get All Tables
export function get_All_Goals(data:{limit:number,page:number}){
    return API.get(`/allTables/allGoals?page=${data.page}&limit=${data.limit}`)
}

// Retire routes
export function add_Retire_Goal(data:AddRetireGoalObj){
    return API.post("/retire/createRetire",data)
}
export function update_Retire_Goal(data:{type:"Retirement" | "House" | "Car", id:string, inputData:RetirementGoals}){
    return API.post("/retire/updateRetire",data)
}

export function update_RetireTable_Title(data:{title:string, id:string | undefined}){
    return API.put("/retire/updateTitle",data)
}

// House Routes
export function create_House_Goal(data:AddHouseGoalObj){
    return API.post("/house/createHouseGoal",data)
}

// All Tables
export function delete_A_Goal(data:{type:"Retirement" | "House" | "Car", id:string}){
    return API.delete(`/allTables/delete?type=${data.type}&id=${data.id}`)
}