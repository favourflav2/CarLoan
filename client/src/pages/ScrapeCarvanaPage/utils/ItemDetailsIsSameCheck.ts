import { ItemDetailsState } from "../../../redux/features/carStateSlice";
import _ from "lodash";

export function itemDetailsIsSameCheck(
  data: {
    price: string;
    downPayment: string;
    interest: string;
    term: number;
    extraPayment: string;
  },
  state: ItemDetailsState
) {
  const newObj: ItemDetailsState = {
    price: parseFloat(data.price.replace(/[,%$]/gm, "")),
    downPayment: parseFloat(data.downPayment.replace(/[,%$]/gm, "")),
    extraPayment: parseFloat(data.extraPayment.replace(/[,%$]/gm, "")),
    interest: parseFloat(data.interest.replace(/[,%$]/gm, "")),
    term: data.term,
  };

  if (newObj.price <= 0) return false;


return _.isEqual(state, newObj) ? false : true;
  
}
