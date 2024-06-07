import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express'

 export interface IGetUserAuthInfoRequest extends Request {
  userId?: string // or any other type
  
}

export interface ResetPasswordMiddleware extends Request {
  resetUserEmail?:string
}


export async function authMiddleware(req:IGetUserAuthInfoRequest, res:Response, next:NextFunction) {
  let token;

  if (req.headers.authorization) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (token) {
        const decode = jwt.verify(token, process.env.SECRET as string) as JwtPayload;
        req.userId = decode?.id;
      }
      next();
    } catch (e) {
      // Token did not pass verification
      console.log(e);
      res.status(401).json({ msg: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ msg: "Not authorized, no token detected" });
  }
}


export async function resetPasswordMiddleware(req:ResetPasswordMiddleware,res:Response, next:NextFunction){
  let token
 

  if (req.headers.passwordauth) {
    try {
      token =(req.headers.passwordauth as string).split(" ")[1];

      if (token) {
        const decode = jwt.verify(token, process.env.SECRET as string) as JwtPayload;
         req.resetUserEmail = decode?.email
      }
      next();
    } catch (e) {
      // Token did not pass verification
      console.log(e);
      res.status(401).json({ msg: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ msg: "Not authorized, your session has expired " });
  }

}