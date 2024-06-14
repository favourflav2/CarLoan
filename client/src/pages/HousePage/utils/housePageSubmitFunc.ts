import { HouseObjWithFormattedData } from "../../../redux/features/modalSlices/houseSlice";
import { FormFieldsHousePage } from "../HousePageInputs";

export function UpdateHouseGoalWithUser(data:FormFieldsHousePage, userId:string, select: HouseObjWithFormattedData){
    const { id, streetAddress, price, downPayment, interest, term, extraPayment, img, propertyTax, insurance, mortgageInsurance, appreciation, opportunityCostRate, maintenance, rent } = data;


    const newObj: HouseObjWithFormattedData = {
        id,
        streetAddress,
        price: parseFloat(price.replace(/[,%$]/gm, "")),
        downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
        interest: parseFloat(interest.replace(/[,%$]/gm, "")),
        term,
        extraPayment: parseFloat(extraPayment.replace(/[,%$]/gm, "")),
        img: img ? img : "",
        propertyTax: parseFloat(propertyTax.replace(/[,%$]/gm, "")),
        insurance: parseFloat(insurance.replace(/[,%$]/gm, "")),
        mortgageInsurance: parseFloat(mortgageInsurance.replace(/[,%$]/gm, "")),
        appreciation: parseFloat(appreciation.replace(/[,%$]/gm, "")),
        opportunityCostRate: parseFloat(opportunityCostRate.replace(/[,%$]/gm, "")),
        maintenance: parseFloat(maintenance.replace(/[,%$]/gm, "")),
        rent: parseFloat(rent.replace(/[,%$]/gm, "")),
        type: "House",
        showTax: select.showTax,
        showInputs: select.showInputs,
        showOppCostInputs: select.showOppCostInputs,
        creator:userId,
        date:select.date
      };

      return newObj
}

export function UpdateHouseGoalWithNoUser(data:FormFieldsHousePage, select: HouseObjWithFormattedData){
    const { id, streetAddress, price, downPayment, interest, term, extraPayment, img, propertyTax, insurance, mortgageInsurance, appreciation, opportunityCostRate, maintenance, rent } = data;


    const newObj: HouseObjWithFormattedData = {
        id,
        streetAddress,
        price: parseFloat(price.replace(/[,%$]/gm, "")),
        downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
        interest: parseFloat(interest.replace(/[,%$]/gm, "")),
        term,
        extraPayment: parseFloat(extraPayment.replace(/[,%$]/gm, "")),
        img: img ? img : "",
        propertyTax: parseFloat(propertyTax.replace(/[,%$]/gm, "")),
        insurance: parseFloat(insurance.replace(/[,%$]/gm, "")),
        mortgageInsurance: parseFloat(mortgageInsurance.replace(/[,%$]/gm, "")),
        appreciation: parseFloat(appreciation.replace(/[,%$]/gm, "")),
        opportunityCostRate: parseFloat(opportunityCostRate.replace(/[,%$]/gm, "")),
        maintenance: parseFloat(maintenance.replace(/[,%$]/gm, "")),
        rent: parseFloat(rent.replace(/[,%$]/gm, "")),
        type: "House",
        showTax: select.showTax,
        showInputs: select.showInputs,
        showOppCostInputs: select.showOppCostInputs,
        creator:null,
        date:null
      };

      return newObj
}