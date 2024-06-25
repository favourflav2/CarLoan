import axios from "axios";
import {  createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { VideoLinkObj } from "../features/howToInvestSlice";




const API = axios.create({ baseURL: "http://localhost:5001/howToInvest" });


// Get all content creators
export function get_All_Content_Creators(data:{page:number}){
    return API.get(`/getAllCreators?page=${data.page}`)
}

export function get_All_Vidoe_Links_By_Id(data:any){
    return API.post("/getVideoLinks",data)
}


// Craete APi
export const howToInvestCreateApi = createApi({
    reducerPath:"howToInvestCreateApi",
    baseQuery: fetchBaseQuery({baseUrl:`http://localhost:5001/howToInvest`}),
    endpoints: (builder) => ({
        getVideoLinksById: builder.query<Array<VideoLinkObj>,{creatorId:string}>({
            query:(body:{creatorId:string}) => ({
                url:`/getVideoLinks`,
                method:"POST",
                body:body
            })
        }),
        getAllBooks:builder.query<Array<any>,{page:number}>({
            query:(body:{page:number}) => ({
                url:`/getAllBooks`,
                method:"POST",
                body:body
            })
        }),
    })
})



export const {useGetVideoLinksByIdQuery} = howToInvestCreateApi