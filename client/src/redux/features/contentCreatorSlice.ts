import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get_All_Content_Creators } from "../api/contentCreatorAPi";
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

interface ContentCreatorObj {
  creatorData: {
    page: number;
    limit: number;
    totalPages: number | null;
    totalCount: number | null;
    data: Array<CreatorDataObj>;
    creatorLoading: boolean;
    creatorError: any;
  };
}

const initialState: ContentCreatorObj = {
  creatorData: {
    page: 1,
    limit: 4,
    totalPages: null,
    totalCount: null,
    data: [],
    creatorLoading: false,
    creatorError: "",
  },
};

export const getAllContentCreators = createAsyncThunk("getAllContentCreators", async (data: { page: number }, { rejectWithValue }) => {
  try {
    const res = await get_All_Content_Creators(data);
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});

const contentCreatorSlice = createSlice({
  name: "contentCreatorSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder

      // Fetch All Goals
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
      });
  },
});

export default contentCreatorSlice.reducer;
