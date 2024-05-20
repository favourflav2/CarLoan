import { PayloadAction, createSlice, isAction } from "@reduxjs/toolkit";
import { FormFieldsItemDetails } from "../../pages/itemDetails/hooks/useItemDetailsFormHook";


interface LoanObj {
  installments: [
    {
      capital: number;
      interest: number;
      installment: number;
      remain: number;
    }
    //...
  ];
  amount: number;
  interestSum: number;
  capitalSum: number;
  sum: number;
}


export interface FilterDataObj {
  lowPrice: number;
  highPrice: number;
  highMileage: number;
  lowMileage: number;
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

export interface MakeAndModal {
  Acura: false;
  AlfaRomeo: false;
  Audi: false;
  BMW: false;
  Buick: false;
  Cadillac: false;
  Chevrolet: false;
  Chrysler: false;
  Dodge: false;
  FIAT: false;
  Ford: false;
  Genesis: false;
  GMC: false;
  Honda: false;
  Hyundai: false;
  INFINITI: false;
  Jaguar: false;
  Jeep: false;
  Kia: false;
  LandRover: false;
  Lexus: false;
  Lincoln: false;
  Lucid: false;
  Maserati: false;
  Mazada: false;
  MercedesBenz: false;
  MINI: false;
  Mitsubishi: false;
  Nissan: false;
  Polestar: false;
  Porsche: false;
  Ram: false;
  Rivian: false;
  Scion: false;
  Subaru: false;
  Telsa: false;
  Toyota: false;
  Volkswagen: false;
  Volvo: false;
}

export interface ItemDetailsState {
  price:number;
  downPayment:number;
  interest:number;
  extraPayment:number;
  term:number
}

interface PageState {
  loading: boolean;
  error: any;
  filterStates: FilterDataObj;
  currentPage: number;
  itemDetailsState:ItemDetailsState | null




  itemParamsState: string | null;


}

const initialState: PageState = {
  loading: false,
  error: "",
  filterStates: {
    lowPrice: 0,
    highPrice: 1750000,
    lowMileage: 0,
    highMileage: 300000,
    sortByState: "All",
    makeAndModalStates: {
      Acura: false,
      AlfaRomeo: false,
      Audi: false,
      BMW: false,
      Buick: false,
      Cadillac: false,
      Chevrolet: false,
      Chrysler: false,
      Dodge: false,
      FIAT: false,
      Ford: false,
      Genesis: false,
      GMC: false,
      Honda: false,
      Hyundai: false,
      INFINITI: false,
      Jaguar: false,
      Jeep: false,
      Kia: false,
      LandRover: false,
      Lexus: false,
      Lincoln: false,
      Lucid: false,
      Maserati: false,
      Mazada: false,
      MercedesBenz: false,
      MINI: false,
      Mitsubishi: false,
      Nissan: false,
      Polestar: false,
      Porsche: false,
      Ram: false,
      Rivian: false,
      Scion: false,
      Subaru: false,
      Telsa: false,
      Toyota: false,
      Volkswagen: false,
      Volvo: false,
    },
  },
  currentPage: 1,
  itemDetailsState: null,
  
  
  itemParamsState: null,
 
};

const carStateSlice = createSlice({
  name: "carStateSlice",
  initialState,
  reducers: {
    setSortByState: (state, action:PayloadAction<"All" | "Highest Price" | "Lowest Price" | "Lowest Mileage">) => {
      state.filterStates.sortByState = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setFilterStates: (state, action: PayloadAction<FilterDataObj>) => {
      state.filterStates = action.payload;
    },
    clearFilters: (state, action: PayloadAction<FilterDataObj>) => {
      state.filterStates = action.payload;
    },
    setBoxPrice: (state) => {
      state.filterStates.lowPrice = 0;
      state.filterStates.highPrice = 1750000;
    },
    setBoxMileage: (state) => {
      state.filterStates.lowMileage = 0;
      state.filterStates.highMileage = 300000;
    },
    setBoxModal: (state, action: PayloadAction<string>) => {
      state.filterStates.makeAndModalStates[action.payload as keyof MakeAndModal] = !state.filterStates.makeAndModalStates[action.payload as keyof MakeAndModal];
    },
    setItemDetailsState: (state,action: PayloadAction<ItemDetailsState>) => {
      state.itemDetailsState = action.payload
    },
    clearItemDetailsState: (state) => {
      state.itemDetailsState = null
    },
    setPageId: (state,action:PayloadAction<string>) => {
      state.itemParamsState = action.payload
    }
    
  },
});

export default carStateSlice.reducer;
export const {
  setCurrentPage,
  setFilterStates,
  clearFilters,
  setBoxMileage,
  setBoxPrice,
  setBoxModal,
  setSortByState,
  setItemDetailsState,
  clearItemDetailsState,
  setPageId
} = carStateSlice.actions;
