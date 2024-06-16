import { HouseObjWithFormattedData } from "../../../redux/features/modalSlices/houseSlice";
import { FormFieldsHousePageOppCost } from "../OppCost/OppCostInputs";

export function UpdateHouseGoalOppCostWithUser(select:HouseObjWithFormattedData,data:FormFieldsHousePageOppCost, userId:string){
    const { interest: interestData, propertyTax: propertyTaxData, appreciation: appreciationData, opportunityCostRate: opportunityCostRateData, maintenance: maintenanceData, rent: rentData } = data;

    const newObj: HouseObjWithFormattedData = {
        id: select.id,
        streetAddress: select.streetAddress,
        price: select.price,
        downPayment: select.downPayment,
        interest: parseFloat(interestData.replace(/[,%$]/gm, "")),
        term: select.term,
        extraPayment: select.extraPayment,
        img: select.img ? select.img : "",
        propertyTax: parseFloat(propertyTaxData.replace(/[,%$]/gm, "")),
        insurance: select.insurance,
        mortgageInsurance: select.mortgageInsurance,
        appreciation: parseFloat(appreciationData.replace(/[,%$]/gm, "")),
        opportunityCostRate: parseFloat(opportunityCostRateData.replace(/[,%$]/gm, "")),
        maintenance: parseFloat(maintenanceData.replace(/[,%$]/gm, "")),
        rent: parseFloat(rentData.replace(/[,%$]/gm, "")),
        type: "House",
        showTax: select.showTax,
        showInputs: select.showInputs,
        showOppCostInputs: select.showOppCostInputs,
        creator:userId,
        date:select.date
      };

      return newObj
}

export function UpdateHouseGoalOppCostWithNoUser(select:HouseObjWithFormattedData,data:FormFieldsHousePageOppCost){
    const { interest: interestData, propertyTax: propertyTaxData, appreciation: appreciationData, opportunityCostRate: opportunityCostRateData, maintenance: maintenanceData, rent: rentData } = data;

    const newObj: HouseObjWithFormattedData = {
        id: select.id,
        streetAddress: select.streetAddress,
        price: select.price,
        downPayment: select.downPayment,
        interest: parseFloat(interestData.replace(/[,%$]/gm, "")),
        term: select.term,
        extraPayment: select.extraPayment,
        img: select.img ? select.img : "",
        propertyTax: parseFloat(propertyTaxData.replace(/[,%$]/gm, "")),
        insurance: select.insurance,
        mortgageInsurance: select.mortgageInsurance,
        appreciation: parseFloat(appreciationData.replace(/[,%$]/gm, "")),
        opportunityCostRate: parseFloat(opportunityCostRateData.replace(/[,%$]/gm, "")),
        maintenance: parseFloat(maintenanceData.replace(/[,%$]/gm, "")),
        rent: parseFloat(rentData.replace(/[,%$]/gm, "")),
        type: "House",
        showTax: select.showTax,
        showInputs: select.showInputs,
        showOppCostInputs: select.showOppCostInputs,
        creator:null,
        date:null
      };

      return newObj

}