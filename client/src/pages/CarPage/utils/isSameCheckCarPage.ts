import { CarObjWithFormattedData } from "../../../redux/features/modalSlices/carModalSlice";
import _ from "lodash";

type OnlyInputs = Omit<CarObjWithFormattedData, "creator" | "date" | "img" | "showInputs" | "name">;

export function isTheSameCheckCarPage(
  select: CarObjWithFormattedData,
  inputStates: {
    price: string;
    downPayment: string;
    interest: string;
    term: number;
    id: string;
    extraPayment: string;
    name: string;
    mileage: string;
    modal: string;
    img?: any;
  }
) {

    const { id, price, mileage, term, modal, downPayment, interest, extraPayment } = inputStates

    const newObj: OnlyInputs = {
        id,
        type: "Car",
        price: parseFloat(price.replace(/[,%$]/gm, "")),
        downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
        interest: parseFloat(interest.replace(/[,%$]/gm, "")),
        mileage: parseFloat(mileage.replace(/[,%$]/gm, "")),
        modal,
        term,
        extraPayment: parseFloat(extraPayment.replace(/[,%$]/gm, "")),
    }

    const stateSelect: OnlyInputs = {
        id:select.id,
        type: "Car",
        price: select.price,
        downPayment: select.downPayment,
        interest: select.interest,
        mileage: select.mileage,
        modal: select.modal,
        term: select.term,
        extraPayment: select.extraPayment,
    }

    return _.isEqual(stateSelect, newObj) ? false : true;

}
