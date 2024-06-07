import { Request, Response } from "express";
import { ResetPasswordMiddleware } from "../../middleware/authMiddleware.js";

// Sign Up type
export interface SignUpReq extends Request {
    body:{
      name:string;
      password:string;
      email:string;
    }
}


// Log In type
export interface LoginReq extends Request {
    body:{
      password:string;
      email:string; 
    }
  }


// Forgot Password type
  export interface ForgotPassword extends Request {
    body:{
      email:string; 
    }
}


// Check Otp Value type
export interface CheckOtp extends ResetPasswordMiddleware {
    body:{
      code:string | number; 
    }
  }


// Reset Password Type
  export interface Reset_Password extends ResetPasswordMiddleware {
    body:{
      password:string
    },
  }