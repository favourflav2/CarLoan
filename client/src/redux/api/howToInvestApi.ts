import axios from "axios";
import {  createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BooksObj, VideoLinkObj } from "../features/howToInvestSlice"

type Page = number;

const devEnv = process.env.NODE_ENV !== "production"

const localAPI = `${process.env.REACT_APP_LOCALHOST_API}/howToInvest`
const prodAPI = `${process.env.REACT_APP_PROD_API}/howToInvest`

const API = axios.create({ baseURL: `${devEnv ? localAPI : prodAPI }` });


// Get all content creators
export function get_All_Content_Creators(data:{page:number}){
    return API.get(`/getAllCreators?page=${data.page}`)
}

export function get_All_Vidoe_Links_By_Id(data:any){
    return API.post("/getVideoLinks",data)
}

export function practice_Fun(page:any){
    return API.get(`/getAllBooks?page=${page}`)
}


// Craete APi
export const howToInvestCreateApi = createApi({
    reducerPath:"howToInvestCreateApi",
    baseQuery: fetchBaseQuery({baseUrl:`${devEnv ? localAPI : prodAPI }`}),
    endpoints: (builder) => ({
        getVideoLinksById: builder.query<Array<VideoLinkObj>,{creatorId:string}>({
            query:(body:{creatorId:string}) => ({
                url:`/getVideoLinks`,
                method:"POST",
                body:body
            })
        }),
        getAllBooks:builder.query<BooksObj,Page>({
            query:(page:number) => ({
                url:`/getAllBooks?page=${page}`,
                method:"GET",
            })
        }),
    })
})



export const {useGetVideoLinksByIdQuery, useGetAllBooksQuery} = howToInvestCreateApi