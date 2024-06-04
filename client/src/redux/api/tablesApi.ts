import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5001" });

API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')){
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile") || '{}').token}`
    }
    return req
})

// Get All Tables
export function get_All_Goals(data:{limit:number,page:number}){
    return API.get(`/allTables/allGoals?page=${data.page}&limit=${data.limit}`)
}