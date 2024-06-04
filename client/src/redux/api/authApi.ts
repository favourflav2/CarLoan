import axios from "axios";
import { LogInObj, SignUpObj } from "../features/authSlice";


const API = axios.create({ baseURL: "http://localhost:5001/auth" });

API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')){
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile") || '{}').token}`
    }
    return req
})

API.interceptors.request.use((req) => {
    if(localStorage.getItem('resetToken')){
        req.headers.PasswordAuth = `Bearer ${JSON.parse(localStorage.getItem("resetToken") || '{}').token}`
    }
    return req
})

export function sign_Up(data:SignUpObj){
    return API.post('/signup',data)
}

export function log_In(data:LogInObj){
    return API.post("/login",data)
}

export function forgot_Password(data:{email:string}){
    return API.post("/forgotPassword",data)
}

export function check_Otp_Value(data:{code:string}){
    return API.post("/checkOtp",data)
}

export function reset_Password(data:{password:string;confirmPassword:string}){
    return API.post("/resetPassword",data)
}