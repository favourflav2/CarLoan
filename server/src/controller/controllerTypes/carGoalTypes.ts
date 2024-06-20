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

  export interface UpdateCarGoal extends IGetUserAuthInfoRequest {
    body:{
        id:string;
        goal:CarObjWithFormattedDataBackendData
    }
  }

  export interface UpdateCarName extends IGetUserAuthInfoRequest {
    body:{
        name:string;
        id:string;
        modal:string;
    }
  }

  export interface DeleteCarGoal extends IGetUserAuthInfoRequest {
    query:{
        itemUUID:string;
        dateAsAWSId:string;
        img:string;
    }
  }

  export interface UpdateCarGoalImg extends IGetUserAuthInfoRequest {
    body:{
        id:string;
        goal:CarObjWithFormattedDataBackendData;
        img:string
    }
  }

  export interface ShowAndHideCarInputs extends IGetUserAuthInfoRequest {
    body:{
        id:string;
        inputs:boolean
    }
  }