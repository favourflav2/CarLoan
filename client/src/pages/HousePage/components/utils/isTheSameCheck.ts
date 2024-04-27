import { HouseObjWithFormattedData } from "../../../../redux/features/modalSlices/houseSlice";
import { CarObjWithFormattedData } from "../../../../redux/features/modalSlices/carModalSlice";
import { RetirementGoals } from "../../../../redux/features/modalSlices/retirementSlice";
import _ from "lodash";

export function isTheSameCheck(select:HouseObjWithFormattedData | RetirementGoals | CarObjWithFormattedData | null,inputs:{
    streetAddress: string;
    price: string;
    downPayment: string;
    interest: string;
    term: number;
    id: string;
    extraPayment: string;
    propertyTax: string;
    insurance: string;
    mortgageInsurance: string;
    appreciation: string;
    opportunityCostRate: string;
    maintenance: string;
    img?: any;
  }){
    if(!select || select.type !== "House" || !inputs) return
  
    const {id, streetAddress, price, downPayment, interest, term, extraPayment, img, propertyTax, insurance, mortgageInsurance, appreciation, opportunityCostRate, maintenance} = inputs

    const {showInputs} = select
  
    const newObj:HouseObjWithFormattedData = {
      id,
      streetAddress,
      price: parseFloat(price.replace(/[,%$]/gm, "")),
      downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
      interest: parseFloat(interest.replace(/[,%$]/gm, "")),
      term,
      extraPayment: parseFloat(extraPayment.replace(/[,%$]/gm, "")),
      img: img ?img : "",
      propertyTax: parseFloat(propertyTax.replace(/[,%$]/gm, "")),
      insurance: parseFloat(insurance.replace(/[,%$]/gm, "")),
      mortgageInsurance: parseFloat(mortgageInsurance.replace(/[,%$]/gm, "")),
      appreciation: parseFloat(appreciation.replace(/[,%$]/gm, "")),
      opportunityCostRate: parseFloat(opportunityCostRate.replace(/[,%$]/gm, "")),
      maintenance: parseFloat(maintenance.replace(/[,%$]/gm, "")),
      type: "House",
      showTax: select.showTax,
      showInputs
     }
  
   return _.isEqual(select,newObj) ? false : true
  
  }