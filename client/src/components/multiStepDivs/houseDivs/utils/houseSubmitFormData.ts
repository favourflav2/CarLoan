import { HouseObj, HouseObjWithFormattedData } from "../../../../redux/features/modalSlices/houseSlice";
import { FormFieldsHouse1stInputs } from "../houseComponents/House1stInputs";

export function LoggedInUserFormData(data: FormFieldsHouse1stInputs, userId: string) {
  const {
    id,
    price,
    downPayment,
    interest,
    term,
    extraPayment,
    streetAddress,
    propertyTax,
    insurance,
    mortgageInsurance,
    appreciation,
    opportunityCostRate,
    maintenance,
    img,
    rent,
  } = data;

  const formattedData: HouseObjWithFormattedData = {
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
    showTax: "monthlyPaymentWithNoTax",
    showInputs: true,
    showOppCostInputs: true,
    date: id,
    creator: userId,
  };

  return formattedData;
}

export function NoUserFormData(data: FormFieldsHouse1stInputs) {
  const {
    id,
    price,
    downPayment,
    interest,
    term,
    extraPayment,
    streetAddress,
    propertyTax,
    insurance,
    mortgageInsurance,
    appreciation,
    opportunityCostRate,
    maintenance,
    img,
    rent,
  } = data;
  const newObj: HouseObj = {
    id,
    price,
    downPayment,
    interest,
    term,
    extraPayment,
    streetAddress,
    propertyTax,
    insurance,
    mortgageInsurance,
    rent,
    appreciation,
    opportunityCostRate,
    maintenance,
    img: img ? img : "",
    showInputs: true,
    showOppCostInputs: true,
    type: "House",
    creator: null,
    date: null,
  };
  return newObj;
}
