import axios from "axios";
import { RetirementGoals } from "../features/modalSlices/retirementSlice";
import { HouseObjWithFormattedData } from "../features/modalSlices/houseSlice";
import { CarObjWithFormattedData } from "../features/modalSlices/carModalSlice";
export interface AddRetireGoalObj {
  creator: string;
  data: RetirementGoals;
}

export interface AddHouseGoalObj {
  creator: string;
  data: HouseObjWithFormattedData;
}

export interface AddCarGoalObj {
  creator:string;
  data:CarObjWithFormattedData
}

const devEnv = process.env.NODE_ENV !== "production"


const API = axios.create({baseURL:`${devEnv ? process.env.REACT_APP_LOCALHOST_API : process.env.REACT_APP_PROD_API }`})

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile") || "{}").token}`;
  }
  return req;
});

// Get All Tables
export function get_All_Goals(data: { limit: number; page: number }) {
  return API.get(`/allTables/allGoals?page=${data.page}&limit=${data.limit}`);
}

// Retire routes
export function add_Retire_Goal(data: AddRetireGoalObj) {
  return API.post("/retire/createRetire", data);
}
export function update_Retire_Goal(data: { type: "Retirement" | "House" | "Car"; id: string; inputData: RetirementGoals }) {
  return API.post("/retire/updateRetire", data);
}

export function update_RetireTable_Title(data: { title: string; id: string | undefined }) {
  return API.put("/retire/updateTitle", data);
}

export function delete_Retire_Goal(data:{type:"Retirement", id:string;}){
  return API.delete(`/retire/deleteRetire?type=${data.type}&id=${data.id}`)
}

// House Routes
export function create_House_Goal(data: AddHouseGoalObj) {
  return API.post("/house/createHouseGoal", data);
}

export function update_House_Goal(data: { type: "House"; id: string; inputData: HouseObjWithFormattedData }) {
  return API.put("/house/updateHouse",data);
}

export function delete_House_Goal(data:{itemUUID:string, dateAsAWSId:string, img:string }){
  return API.delete(`/house/deleteHouse?itemUUID=${data.itemUUID}&dateAsAWSId=${data.dateAsAWSId}&img=${data.img}`)
}


export function update_House_Goal_Opp_Cost(data:{creator:string, goal:HouseObjWithFormattedData, id:string;}){
  return API.put("/house/updateHouseOppCost", data)
}

export function update_House_Goal_Img(data:{goal:HouseObjWithFormattedData, id:string, img:string}){
  return API.put("/house/updateHouseImg", data)
}

export function update_House_Goal_Address(data:{newAddress:string, id:string}){
  return API.put("/house/updateHouseAddress",data)
}

export function hide_And_Show_House_Inputs(data:{id:string, inputs:boolean}){
  return API.put("/house/showInputs", data)
}

export function hide_And_Show_House_OppCost_Inputs(data:{id:string, oppCostInputs:boolean}){
  return API.put("/house/showOppCostInputs", data)
}


// ---------------------------------- Car Goal Routes -------------------------------
export function create_Car_Goal(data:AddCarGoalObj){
  return API.post("/carGoals/createCar", data);
}

export function update_Car_Goal(data:{id:string, goal:CarObjWithFormattedData}){
  return API.put("/carGoals/updateCar",data)
}

export function update_Car_Name(data:{id:string, name:string, modal:string}){
  return API.put("/carGoals/updateCarName", data)
}

export function delete_Car_Goal(data:{itemUUID:string, dateAsAWSId:string, img:string }){
  return API.delete(`/carGoals/deleteCar?itemUUID=${data.itemUUID}&dateAsAWSId=${data.dateAsAWSId}&img=${data.img}`)
}

export function update_Car_Goal_Img(data:{goal:CarObjWithFormattedData, id:string; img:string}){
return API.put("/carGoals/updateImg",data)
}

export function hide_And_Show_Car_Inputs(data:{id:string; inputs:boolean}){
return API.put("/carGoals/hideAndShowCarInputs", data)
} 