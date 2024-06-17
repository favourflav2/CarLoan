import { CarObj, CarObjWithFormattedData } from "../../../../redux/features/modalSlices/carModalSlice";
import { FormFieldsCar1stInputs } from "../CarComponets/Car1stInputs";

export function CreateCarGoalWithUser(data: FormFieldsCar1stInputs, userId: string) {
  const { price, downPayment, interest, term, id, mileage, name, modal, img } = data;
  const newObj: CarObjWithFormattedData = {
    id,
    name,
    price: parseFloat(price.replace(/[,%$]/gm, "")),
    mileage: parseFloat(mileage.replace(/[,%$]/gm, "")),
    downPayment: parseFloat(downPayment.replace(/[,%$]/gm, "")),
    interest: parseFloat(interest.replace(/[,%$]/gm, "")),
    term,
    img: img ? img : "",
    modal,
    type:"Car",
    extraPayment:0,
    showInputs:true,
    creator:userId,
    date:id
  };

  return newObj
}

export function CreateCarGoalWithNoUser(data: FormFieldsCar1stInputs) {
  const { price, downPayment, interest, term, id, extraPayment, mileage, name, modal, img } = data;

  const newObj: CarObj = {
    price,
    downPayment,
    interest,
    term,
    id,
    extraPayment,
    mileage,
    name,
    modal,
    img: img ? img : "",
    showInputs: true,
    type: "Car",
    creator: null,
    date: null,
  };

  return newObj;
}
