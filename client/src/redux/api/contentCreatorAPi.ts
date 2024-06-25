import axios from "axios";
import {  createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { VideoLinkObj } from "../features/contentCreatorSlice";




const API = axios.create({ baseURL: "http://localhost:5001/contentCreator" });


// Get all content creators
export function get_All_Content_Creators(data:{page:number}){
    return API.get(`/getAllCreators?page=${data.page}`)
}

export function get_All_Vidoe_Links_By_Id(data:any){
    return API.post("/getVideoLinks",data)
}


// Craete APi
export const contentCreatorApi = createApi({
    reducerPath:"contentCreatorApi",
    baseQuery: fetchBaseQuery({baseUrl:`http://localhost:5001/contentCreator`}),
    endpoints: (builder) => ({
        getVideoLinksById: builder.query<Array<VideoLinkObj>,{creatorId:string}>({
            query:(body:{creatorId:string}) => ({
                url:`/getVideoLinks`,
                method:"POST",
                body:body
            })
        })
    })
})



export const {useGetVideoLinksByIdQuery} = contentCreatorApi