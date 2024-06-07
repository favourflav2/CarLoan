import { Request, Response } from "express";

// Filter Data Sent from frontend
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

// Simple make amd modal type
export interface MakeAndModalStates {
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
}

// Filter Data Sent from frontend Request
export interface FilterData extends Request {
  body: FilterDataBackendData;
}

// These interaces and types are for my filter dat function ... when im using item[key]
export interface FilterFuncType {
  price: (price: number) => boolean;
  mileage: (mileage: number) => boolean;
  name_modal: string[];
}

export type NameANdModalType = {
  name_modal: string[];
};

export type PriceAndMileage = {
  price: (price: number) => boolean;
  mileage: (mileage: number) => boolean;
};

// Search function type
export interface SearchCars extends Request {
  body: {
    searchValue: string;
  };
}

// Item Details
export interface ItemDetails extends Request {
    body:{
        id:string;
    }
}

// Single Car
export interface SimilarCars extends ItemDetails {
    
}
