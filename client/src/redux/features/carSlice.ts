import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { carVana_Data, filter_Data, get_One_Car, related_Cars, search_Cars, similar_Cars } from "../api/carApi";

export interface CarVanaDataObj {
img:string;
type:string;
name_modal:string;
mileage:number;
price:number;
mileage_name: string;
deal:string;
index:number
}

export interface PaginatedData {
  cars: Array<CarVanaDataObj>;
  page:number;
  limit:number;
  totalCount:number
  totalPages:number;

}

export interface FilterDataBackendData {
  page: number;
  lowPrice: number;
  highPrice: number;
  lowMileage: number;
  highMileage: number;
  sortByState: "All" | "Highest Price" | "Lowest Price" | "Lowest Mileage";
  makeAndModalStates: {
    Acura: boolean;
    AlfaRomeo: boolean;
    Audi: boolean;
    BMW: boolean;
    Buick: boolean;
    Cadillac: boolean;
    Chevrolet: boolean;
    Chrysler: boolean;
    Dodge: boolean;
    FIAT: boolean;
    Ford: boolean;
    Genesis: boolean;
    GMC: boolean;
    Honda: boolean;
    Hyundai: boolean;
    INFINITI: boolean;
    Jaguar: boolean;
    Jeep: boolean;
    Kia: boolean;
    LandRover: boolean;
    Lexus: boolean;
    Lincoln: boolean;
    Lucid: boolean;
    Maserati: boolean;
    Mazada: boolean;
    MercedesBenz: boolean;
    MINI: boolean;
    Mitsubishi: boolean;
    Nissan: boolean;
    Polestar: boolean;
    Porsche: boolean;
    Ram: boolean;
    Rivian: boolean;
    Scion: boolean;
    Subaru: boolean;
    Telsa: boolean;
    Toyota: boolean;
    Volkswagen: boolean;
    Volvo: boolean;
  };
}

export interface DataObj {
  img: string;
  type: string;
  mileage: string;
  price: number;
  mileage_name: string;
  name_modal: string;
  deal: string;
  index: number;
}

interface CarState {
  carVana: null | PaginatedData;
  loading: boolean;
  searchLoading: boolean;
  searchError:any
  error: any;
  relatedCars: Array<any>;
  searchedCars: Array<any>;
  singleCar: DataObj | null;
  similarCarsData: Array<any> | null;
  similarLoading: boolean;
  similarError:any
}

const initialState: CarState = {
  carVana: null,
  loading: false,
  searchLoading: false,
  error: "",
  searchError:"",
  relatedCars: [],
  searchedCars: [],
  singleCar: null,
  similarCarsData: null,
  similarLoading: false,
  similarError: ""
};

export const carVanaData = createAsyncThunk("carvanaData", async ({ page }: any, { rejectWithValue }) => {
  try {
    const res = await carVana_Data(page);
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});

export const filterData = createAsyncThunk(
  "filterData",
  async ({ lowMileage, highMileage, lowPrice, highPrice, makeAndModalStates, sortByState, page }: FilterDataBackendData, { rejectWithValue }) => {
    try {
      const res = await filter_Data({ lowMileage, highMileage, lowPrice, highPrice, makeAndModalStates, sortByState, page });
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response.data.msg);
    }
  }
);

export const relatedCarsRedux = createAsyncThunk("relatedCarsRedux", async (_, { rejectWithValue }) => {
  try {
    const res = await related_Cars();
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});

export const searchCars = createAsyncThunk("searchCars", async ({searchValue}:{searchValue:string}, { rejectWithValue }) => {
  try {
    const res = await search_Cars({searchValue});
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});

export const getOneCar = createAsyncThunk("getOneCar", async ({ id }: any, { rejectWithValue }) => {
  try {
    const res = await get_One_Car({ id });
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});

export const similarCars = createAsyncThunk("similarCars", async ({ id }: {id:string}, { rejectWithValue }) => {
  try {
    const res = await similar_Cars({ id });
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e.response.data.msg);
  }
});

const carSlice = createSlice({
  name: "carSlice",
  initialState,
  reducers: {
    setSearchedCars: (state) => {
      state.searchedCars = [];
    },
    setCarSliceError: (state) => {
      state.error = "";
    },
    setSearchError: (state) => {
      state.searchError = ""
    }
  },
  extraReducers(builder) {
    builder

      // Fetch All Data
      .addCase(carVanaData.pending, (state) => {
        state.loading = true;
      })
      .addCase(carVanaData.fulfilled, (state, action) => {
        state.loading = false;
        state.carVana = action.payload;
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
        state.carVana = action.payload;
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
        state.relatedCars = action.payload;
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
        state.searchedCars = action.payload;
      })
      .addCase(searchCars.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      })

      // Get One Car
      .addCase(getOneCar.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOneCar.fulfilled, (state, action) => {
        state.loading = false;
        state.singleCar = action.payload;
      })
      .addCase(getOneCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Similar Cars
      .addCase(similarCars.pending, (state) => {
        state.similarLoading = true;
      })
      .addCase(similarCars.fulfilled, (state, action) => {
        state.similarLoading = false;
        state.similarCarsData = action.payload;
      })
      .addCase(similarCars.rejected, (state, action) => {
        state.similarLoading = false;
        state.similarError= action.payload;
      });
  },
});

export default carSlice.reducer;
export const { setSearchedCars, setCarSliceError } = carSlice.actions;
