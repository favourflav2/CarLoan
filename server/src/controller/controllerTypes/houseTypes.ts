import { Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "../../middleware/authMiddleware.js";

export interface HouseObjWithFormattedDataBackendData {
    id: string;
    streetAddress: string;
    price: number;
    downPayment: number;
    interest: number;
    term: number;
    extraPayment: number;
    img: string;
    propertyTax: number;
    insurance: number;
    mortgageInsurance: number;
    appreciation: number;
    opportunityCostRate: number;
    maintenance: number;
    type: "House";
    showTax:"monthlyPaymentWithTax" | "monthlyPaymentWithNoTax";
    showInputs:boolean;
    rent:number;
    showOppCostInputs:boolean;
    creator:string
    date: string
  }

// Create House Goal
export interface CreateHouseGoal extends IGetUserAuthInfoRequest {
    body:{
        creator:string;
        data:HouseObjWithFormattedDataBackendData
    }
}