import { HouseObjWithFormattedData } from "../../../../redux/features/modalSlices/houseSlice";
import { CarObjWithFormattedData } from "../../../../redux/features/modalSlices/carModalSlice";
import { RetirementGoals } from "../../../../redux/features/modalSlices/retirementSlice";
import _ from "lodash";

type FormFieldsOppCost = {
  opportunityCostRate: string;
  maintenance: string;
  rent: string;
  appreciation: string;
  propertyTax: string;
  interest: string;
};

type OppCostTrimSelectedGoal = {
  opportunityCostRate: number;
  maintenance: number;
  rent: number;
  appreciation: number;
  propertyTax: number;
  interest: number;
};

type OnlyInputs = Omit<HouseObjWithFormattedData, "creator" | "date" | "img">;

export function isTheSameCheck(
  select: HouseObjWithFormattedData | RetirementGoals | CarObjWithFormattedData | null,
  inputs: {
    streetAddress: string;
    price: string;
    downPayment: string;
    interest: string;
    term: number;
    id: string;
    extraPayment: string;
    rent: string;
    propertyTax: string;
    insurance: string;
    mortgageInsurance: string;
    appreciation: string;
    opportunityCostRate: string;
    maintenance: string;
    img?: any;
  }
) {
  if (!select || select.type !== "House" || !inputs) return;

  const { id, streetAddress, price, downPayment, interest, term, extraPayment, propertyTax, insurance, mortgageInsurance, appreciation, opportunityCostRate, maintenance, rent } = inputs;

  const { showInputs, showOppCostInputs } = select;

  const newObj: OnlyInputs = {
    id,
    streetAddress,
    price: parseFloat(price.replace(/[,%$]/gm, "")),
    downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
    interest: parseFloat(interest.replace(/[,%$]/gm, "")),
    term,
    extraPayment: parseFloat(extraPayment.replace(/[,%$]/gm, "")),
    propertyTax: parseFloat(propertyTax.replace(/[,%$]/gm, "")),
    insurance: parseFloat(insurance.replace(/[,%$]/gm, "")),
    mortgageInsurance: parseFloat(mortgageInsurance.replace(/[,%$]/gm, "")),
    appreciation: parseFloat(appreciation.replace(/[,%$]/gm, "")),
    opportunityCostRate: parseFloat(opportunityCostRate.replace(/[,%$]/gm, "")),
    maintenance: parseFloat(maintenance.replace(/[,%$]/gm, "")),
    rent: parseFloat(rent.replace(/[,%$]/gm, "")),
    type: "House",
    showTax: select.showTax,
    showInputs,
    showOppCostInputs
  };

  const stateSelect:OnlyInputs = {
    id:select.id,
    streetAddress: select.streetAddress,
    price: select.price,
    downPayment: select.downPayment,
    interest: select.interest,
    term: select.term,
    extraPayment: select.extraPayment,
    propertyTax: select.propertyTax,
    insurance: select.insurance,
    mortgageInsurance: select.mortgageInsurance,
    appreciation: select.appreciation,
    opportunityCostRate: select.opportunityCostRate,
    maintenance: select.maintenance,
    rent: select.rent,
    type: "House",
    showTax: select.showTax,
    showInputs,
    showOppCostInputs
  }

  return _.isEqual(stateSelect, newObj) ? false : true;
}

export function isTheSameCheckOppCost(select: HouseObjWithFormattedData | RetirementGoals | CarObjWithFormattedData | null, inputs: FormFieldsOppCost) {
  if (!select || select.type !== "House" || !inputs) return;

  const { interest, propertyTax, appreciation, opportunityCostRate, maintenance, rent } = inputs;
  

  const newObj: OppCostTrimSelectedGoal = {
    interest: parseFloat(interest.replace(/[,%$]/gm, "")),
    propertyTax: parseFloat(propertyTax.replace(/[,%$]/gm, "")),
    appreciation: parseFloat(appreciation.replace(/[,%$]/gm, "")),
    opportunityCostRate: parseFloat(opportunityCostRate.replace(/[,%$]/gm, "")),
    maintenance: parseFloat(maintenance.replace(/[,%$]/gm, "")),
    rent: parseFloat(rent.replace(/[,%$]/gm, "")),
  };

  const selNewObj:OppCostTrimSelectedGoal = {
    interest: select.interest,
    propertyTax: select.propertyTax,
    appreciation: select.appreciation,
    opportunityCostRate: select.opportunityCostRate,
    maintenance: select.maintenance,
    rent: select.rent,
  }


  return _.isEqual(selNewObj, newObj) ? false : true;
}
