import { createSlice } from "@reduxjs/toolkit";

interface Price {
  lowPrice: number;
  highPrice: number;
}

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

interface Mileage {
  highMileage: number;
  lowMileage: number;
}

interface MakeAndModal {
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
  sortByState: string;
  currentPage: number;
  //totalPages:number;
  price: Price;
  carBrand: Array<string>;
  reduxMakeAndModalStates: MakeAndModal;
  mileage: Mileage;
  searchState: string;
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
  StaticMonths: number
}

const initialState: PageState = {
  loading: false,
  error: "",
  sortByState: "All",
  currentPage: 1,
  price: {
    lowPrice: 0,
    highPrice: 1750000,
  },
  carBrand: [],
  reduxMakeAndModalStates: {
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
  mileage: {
    highMileage: 300000,
    lowMileage: 0,
  },
  searchState: "",
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
  StaticMonths: 60
};

const websiteSlice = createSlice({
  name: "websiteSlice",
  initialState,
  reducers: {
    setSortByState: (state, action) => {
      state.sortByState = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPricePersist: (state, action) => {
      if (action.payload.type === "lowPrice") {
        state.price.lowPrice = action.payload.value;
      } else if (action.payload.type === "highPrice") {
        state.price.highPrice = action.payload.value;
      }
    },
    setMileagePersist: (state, action) => {
      if (action.payload.type === "lowMileage") {
        state.mileage.lowMileage = action.payload.value;
      } else if (action.payload.type === "highMileage") {
        state.mileage.highMileage = action.payload.value;
      }
    },
    setMakeAndModalRedux: (state, action) => {
      //console.log(action.payload,"Action payload")
      let objData = state.reduxMakeAndModalStates;
      for (let item in objData) {
        if (item === action.payload) {
          // @ts-ignore
          objData[item] = !objData[item];
        }
      }
      state.reduxMakeAndModalStates = objData;
    },
    returnPriceStateToNormal: (state) => {
      state.price.lowPrice = 0;
      state.price.highPrice = 1750000;
    },
    clearAllFilters: (state) => {
      state.price.lowPrice = 0;
      state.price.highPrice = 1750000;
      state.reduxMakeAndModalStates = {
        Acura: false,
        AlfaRomeo: false,
        Audi: false,
        Buick: false,
        Cadillac: false,
        BMW: false,
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
      };
      state.mileage = {
        lowMileage: 0,
        highMileage: 300000,
      };
      state.currentPage = 1;
    },
    returnMileageStatetoNormal: (state) => {
      state.mileage = {
        lowMileage: 0,
        highMileage: 300000,
      };
    },
    setSearchState: (state, action) => {
      state.searchState = action.payload;
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
      state.StaticInterestRate = 11.35
      state.StaticMonths = 60
      state.loanData = null;
      state.compareData = null
    },
  },
  // extraReducers(builder){
  //     builder

  //     // Save Tv or Movie
  //   .addCase(carVanaData.pending, (state) => {
  //     state.loading = true;
  //   })
  //   .addCase(carVanaData.fulfilled, (state, action) => {
  //     state.loading = false;
  //     state.carVana = action.payload
  //   })
  //   .addCase(carVanaData.rejected, (state, action) => {
  //     state.loading = false;
  //     state.error = action.payload;
  //   })
  // }
});

export default websiteSlice.reducer;
export const {
  setSortByState,
  setCurrentPage,
  setPricePersist,
  setMakeAndModalRedux,
  setMileagePersist,
  returnPriceStateToNormal,
  clearAllFilters,
  returnMileageStatetoNormal,
  setSearchState,
  setLoanAmount,
  setDownPayment,
  updateLoanAmount,
  setMonths,
  setInterestRate,
  setLoanData,
  setItemParamsState,
  setCompareData,
  setTotalPrice,
  resetItemDetailsState
} = websiteSlice.actions;
