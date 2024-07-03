import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get_All_Content_Creators, get_All_Vidoe_Links_By_Id } from "../api/howToInvestApi";
import {toast} from 'react-toastify'

export interface CreatorDataObj {
    id:string;
    name:string;
    twitter:string;
    instagram:string;
    youtube:string;
    photo:string;
    about:string;
}

export interface VideoLinkObj {
    idVideoLink:string;
    title:string;
    link:string;
    aboutVideoLink:string;
    creator:string;
}

export interface BooksArrayObj {
  bookId:string;
  title:string;
  author:string;
  about:string;
  haveRead:boolean;
  amazonLink:string;
  img:string;
}

export interface BooksObj {
  data:Array<BooksArrayObj>;
  page:number;
  limit:number;
  totalPages:number;
  totalCount:number
}

interface ContentCreatorObj {
  creatorData: {
    page: number;
    limit: number;
    totalPages: number | null;
    totalCount: number | null;
    data: Array<CreatorDataObj>;
    creatorLoading: boolean;
    creatorError: any;
  }

  videoLinkData:{
    loading:boolean;
    error:any
    data:string;
  }
}

export const initialState: ContentCreatorObj = {
  creatorData: {
    page: 1,
    limit: 4,
    totalPages: null,
    totalCount: null,
    data: [],
    creatorLoading: false,
    creatorError: "",
  },
  videoLinkData:{
    loading:false,
    error:"",
    data:""
  }
};

export const getAllContentCreators = createAsyncThunk("getAllContentCreators", async (data: { page: number }, { rejectWithValue }) => {
  try {
    const res = await get_All_Content_Creators(data);
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});

export const getAllVideoLinksById = createAsyncThunk("getAllVideoLinksById", async (data: any, { rejectWithValue }) => {
    try {
      const res = await get_All_Vidoe_Links_By_Id(data);
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response.data.msg);
    }
  });

const howToInvestSlice = createSlice({
  name: "howToInvestSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder

      // Fetch All Content Creators
      .addCase(getAllContentCreators.pending, (state) => {
        state.creatorData.creatorLoading = true;
      })
      .addCase(getAllContentCreators.fulfilled, (state, action) => {
        state.creatorData = action.payload;
        state.creatorData.creatorError = "";
        state.creatorData.creatorLoading = false;
      })
      .addCase(getAllContentCreators.rejected, (state, action:PayloadAction<any>) => {
        state.creatorData.creatorError = action.payload;
        toast.error(action.payload as string)
        state.creatorData.creatorLoading = false;
      })

       // Fetch All Vidoe Links
       .addCase(getAllVideoLinksById.pending, (state) => {
        state.videoLinkData.loading = true;
      })
      .addCase(getAllVideoLinksById.fulfilled, (state, action) => {
        state.videoLinkData.data = action.payload;
        state.videoLinkData.error = "";
        state.videoLinkData.loading = false;
      })
      .addCase(getAllVideoLinksById.rejected, (state, action:PayloadAction<any>) => {
        state.videoLinkData.error = action.payload;
        toast.error(action.payload as string)
        state.videoLinkData.loading = false;
      })
  },
});

export default howToInvestSlice.reducer;
