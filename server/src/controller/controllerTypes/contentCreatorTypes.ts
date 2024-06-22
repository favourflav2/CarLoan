import { Request } from "express";

export interface AddContentCreator extends Request {
    body:{
        name:string;
        twitter:string;
        instagram:string;
        youtube:string;
        photo:string;
        about:string;
    }
}