import { CarObjWithFormattedData } from "../../../redux/features/modalSlices/carModalSlice";
import { FormFieldsCarPageInputs } from "../CarPageInputs";

export function updateDataWithUser(data:FormFieldsCarPageInputs, userId:string, select: CarObjWithFormattedData){
    const { img, id, price, mileage, term, name, modal, downPayment, interest, extraPayment } = data;
    const { showInputs } = select;

    const newObj: CarObjWithFormattedData = {
        id,
        name,
        type: "Car",
        price: parseFloat(price.replace(/[,%$]/gm, "")),
        downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
        interest: parseFloat(interest.replace(/[,%$]/gm, "")),
        mileage: parseFloat(mileage.replace(/[,%$]/gm, "")),
        modal,
        term,
        img: img ? img : "",
        extraPayment: parseFloat(extraPayment.replace(/[,%$]/gm, "")),
        showInputs,
        date: select.date,
        creator: userId,
      };

      return newObj

}

export function updateDataWithNoUser(data:FormFieldsCarPageInputs, show:boolean){

    const { img, id, price, mileage, term, name, modal, downPayment, interest, extraPayment } = data;

    const newObj: CarObjWithFormattedData = {
        id,
        name,
        type: "Car",
        price: parseFloat(price.replace(/[,%$]/gm, "")),
        downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
        interest: parseFloat(interest.replace(/[,%$]/gm, "")),
        mileage: parseFloat(mileage.replace(/[,%$]/gm, "")),
        modal,
        term,
        img: img ? img : "",
        extraPayment: parseFloat(extraPayment.replace(/[,%$]/gm, "")),
        showInputs:show,
        date: null,
        creator: null,
      };

      return newObj

}