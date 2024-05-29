import axios from "axios";
import { LogInObj, SignUpObj } from "../features/authSlice";



const API = axios.create({ baseURL: "http://localhost:5001/auth" });

export function sign_Up(data:SignUpObj){
    return API.post('/signup',data)
}

export function log_In(data:LogInObj){
    return API.post("/login",data)
}