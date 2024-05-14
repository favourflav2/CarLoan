import { PayloadAction, createSlice } from "@reduxjs/toolkit";


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

interface PageState {
  loading: boolean;
  error: any;
  filterStates: FilterDataObj;
  currentPage: number;
  //totalPages:number;

  carBrand: Array<string>;

  interestRate: number;
  months: number;
  loanAmount: number;
  downPayment: number;
  errorDownPayment: boolean;
  loanData: LoanObj | null;
  itemParamsState: string | null;
  compareData: Array<any> | null;
  TotalPrice: any;
  StaticDownPayment: number;
  StaticInterestRate: number;
  StaticMonths: number;
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

  carBrand: [],
  interestRate: 11.35,
  months: 60,
  loanAmount: 0,
  downPayment: 0,
  errorDownPayment: false,
  loanData: null,
  itemParamsState: null,
  compareData: null,
  TotalPrice: null,
  StaticDownPayment: 0,
  StaticInterestRate: 11.35,
  StaticMonths: 60,
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
    setLoanAmount: (state, action) => {
      state.loanAmount = Number(action.payload);
    },
    setDownPayment: (state, action) => {
      let maxVal = action.payload.max - 1;

      if (Number(action.payload.value.replace(/[$,]/g, "")) <= maxVal) {
        state.errorDownPayment = false;
        state.downPayment = Number(action.payload.value.replace(/[$,]/g, ""));
      } else {
        state.errorDownPayment = true;
      }
    },
    updateLoanAmount: (state, action) => {
      const { loan, down } = action.payload;
      // console.log(loan,"loan")
      // console.log(down,'down')
      state.loanAmount = loan - down;
    },
    setMonths: (state, action) => {
      state.months = Number(action.payload);
    },
    setInterestRate: (state, action) => {
      state.interestRate = Number(action.payload.replace(/[%]/g, ""));
    },
    setLoanData: (state, action) => {
      state.loanData = action.payload;
    },
    setItemParamsState: (state, action) => {
      state.itemParamsState = action.payload;
    },
    setCompareData: (state, action) => {
      state.compareData = action.payload;
    },
    setTotalPrice: (state, action) => {
      //console.log(action.payload);
      const { loan, downPayment } = action.payload;
      // Format Price
      let USDollar = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });
      state.StaticDownPayment = Number(downPayment);
      state.TotalPrice = USDollar.format(downPayment + loan?.sum);
    },
    resetItemDetailsState: (state) => {
      state.downPayment = 0;
      state.StaticDownPayment = 0;
      state.interestRate = 11.35;
      state.months = 60;
      state.StaticInterestRate = 11.35;
      state.StaticMonths = 60;
      state.loanData = null;
      state.compareData = null;
    },
  },
});

export default carStateSlice.reducer;
export const {
  setCurrentPage,
  setFilterStates,
  setLoanAmount,
  setDownPayment,
  updateLoanAmount,
  setMonths,
  setInterestRate,
  setLoanData,
  setItemParamsState,
  setCompareData,
  setTotalPrice,
  resetItemDetailsState,
  clearFilters,
  setBoxMileage,
  setBoxPrice,
  setBoxModal,
  setSortByState
} = carStateSlice.actions;
