import { Request, Response } from "express";

export interface RetirementGoalsBackEnd {
    type: "Retirement";
    id: string;
    creator:string;
    currentAge: number;
    retireAge: number;
    lifeExpectancy: number;
    savings: number;
    monthlyContribution: number;
    budget: number;
    preRate: number;
    postRate: number;
    inflation: number;
    title: string;
    showInputs: boolean;
    date: Date
  }


  export interface CreateRetireGoal extends Request {
    body:{
        creator:string;
        data:RetirementGoalsBackEnd
    }
  }