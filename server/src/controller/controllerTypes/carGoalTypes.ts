import { IGetUserAuthInfoRequest } from "../../middleware/authMiddleware.js";

export interface CarObjWithFormattedDataBackendData {
    id: string;
    name: string;
    price: number;
    mileage: number;
    downPayment: number;
    interest: number;
    term: number;
    img:  string
    modal: string;
    type:"Car";
    extraPayment: number;
    showInputs:boolean;
    creator:string
    date: string
  }

  export interface CreateCarGoal extends IGetUserAuthInfoRequest {
    body:{
        creator:string;
        data:CarObjWithFormattedDataBackendData
    }
  }