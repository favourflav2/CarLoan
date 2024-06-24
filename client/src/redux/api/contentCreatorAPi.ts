import axios from "axios";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


const API = axios.create({ baseURL: "http://localhost:5001/contentCreator" });


// Get all content creators
export function get_All_Content_Creators(data:{page:number}){
    return API.get(`/getAllCreators?page=${data.page}`)
}


// Craete APi
export const contentCreatorApi = createApi({
    reducerPath:"contentCreatorApi",
    baseQuery: fetchBaseQuery({baseUrl:`http://localhost:5001/contentCreator`}),
    endpoints: (builder) => ({
        getVideoLinksById: builder.query({
            query:(id:string) => ({
                url:`/getVideoLinks?id=${id}`
            })
        })
    })
})

export const {useGetVideoLinksByIdQuery} = contentCreatorApi