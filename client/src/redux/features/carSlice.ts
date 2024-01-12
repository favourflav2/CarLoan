import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { carVana_Data, filter_Data, get_One_Car, related_Cars, search_Cars, similar_Cars } from "../api/carApi";


interface PaginatedData {
  cars: Array<any>
  [prop: string]: any
}

interface DataObj {
  [prop: string]: any
  img: string;
    type: string;
    mileage: string;
    price: number;
    mileage_name: string;
    name_modal: string;
    deal: string;
    index: number
}

interface CarState {
    carVana: null | PaginatedData
    loading: boolean;
    searchLoading: boolean;
    error: any;
    relatedCars: Array<any>;
    searchedCars: Array<any>;
    singleCar: DataObj | null;
    similarCarsData: Array<any> | null
}    

const initialState: CarState = {
    carVana: null,
    loading:false,
    searchLoading: false,
    error:"",
    relatedCars: [],
    searchedCars: [],
    singleCar: null,
    similarCarsData: null
}

export const carVanaData = createAsyncThunk(
    "carvanaData",
    async({page}:any, {rejectWithValue}) => {
        try{
            const res = await carVana_Data(page)
            return res.data

        }catch(e:any){
            return rejectWithValue(e.response.data.msg);
        }
    }
)

export const filterData = createAsyncThunk(
  "filterData",
  async({price, sortByState, modal, page, mileage}:any, {rejectWithValue}) => {
      try{
          const res = await filter_Data({price,sortByState,modal,page, mileage})
          return res.data

      }catch(e:any){
          return rejectWithValue(e.response.data.msg);
      }
  }
)

export const relatedCarsRedux = createAsyncThunk(
  "relatedCarsRedux",
  async(_, {rejectWithValue}) => {
      try{
          const res = await related_Cars()
          return res.data

      }catch(e:any){
          return rejectWithValue(e.response.data.msg);
      }
  }
)

export const searchCars = createAsyncThunk(
  "searchCars",
  async({searchVal}:any, {rejectWithValue}) => {
      try{
          const res = await search_Cars({searchVal})
          return res.data

      }catch(e:any){
          return rejectWithValue(e.response.data.msg);
      }
  }
)

export const getOneCar = createAsyncThunk(
  "getOneCar",
  async({id}:any, {rejectWithValue}) => {
      try{
          const res = await get_One_Car({id})
          return res.data

      }catch(e:any){
          return rejectWithValue(e.response.data.msg);
      }
  }
)


export const similarCars = createAsyncThunk(
  "similarCars",
  async({id}:any, {rejectWithValue}) => {
      try{
          const res = await similar_Cars({id})
          return res.data

      }catch(e:any){
          return rejectWithValue(e.response.data.msg);
      }
  }
)

const carSlice = createSlice({
    name: "carSlice",
    initialState,
    reducers: {
      setSearchedCars: (state) => {
        state.searchedCars = []
      },
      setCarSliceError: (state) =>{
        state.error = ""
      }
    },
    extraReducers(builder){
        builder

        // Fetch All Data
      .addCase(carVanaData.pending, (state) => {
        state.loading = true;
      })
      .addCase(carVanaData.fulfilled, (state, action) => {
        state.loading = false;
        state.carVana = action.payload
      })
      .addCase(carVanaData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       // Filter Data
       .addCase(filterData.pending, (state) => {
        state.loading = true;
      })
      .addCase(filterData.fulfilled, (state, action) => {
        state.loading = false;
        state.carVana = action.payload
      })
      .addCase(filterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Related Cars
      .addCase(relatedCarsRedux.pending, (state) => {
        state.loading = true;
      })
      .addCase(relatedCarsRedux.fulfilled, (state, action) => {
        state.loading = false;
        state.relatedCars = action.payload
      })
      .addCase(relatedCarsRedux.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // Search Cars
      .addCase(searchCars.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchCars.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchedCars = action.payload
      })
      .addCase(searchCars.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })


      // Get One Car
      .addCase(getOneCar.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOneCar.fulfilled, (state, action) => {
        state.loading = false;
        state.singleCar = action.payload
      })
      .addCase(getOneCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // Get Similar Cars
      .addCase(similarCars.pending, (state) => {
        state.loading = true;
      })
      .addCase(similarCars.fulfilled, (state, action) => {
        state.loading = false;
        state.similarCarsData = action.payload
      })
      .addCase(similarCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    }
})

export default carSlice.reducer
export const {setSearchedCars, setCarSliceError} = carSlice.actions