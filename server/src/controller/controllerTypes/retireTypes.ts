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

// Create Retire Goal
  export interface CreateRetireGoal extends Request {
    body:{
        creator:string;
        data:RetirementGoalsBackEnd
    }
  }

  // Update Retire Goal
  export interface UpdateRetireGoal extends Request {
    body:{
      type: "Retirement",
      id:string;
      inputData:{
        type: "Retirement";
        id: string;
        creator:string
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
    }
  }