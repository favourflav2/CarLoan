import { ItemDetailsState } from "../../../redux/features/carStateSlice";
import _ from "lodash";

type HidePrice = Omit<ItemDetailsState, "price">

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
  const newObj: HidePrice = {
    downPayment: parseFloat(data.downPayment.replace(/[,%$]/gm, "")),
    extraPayment: parseFloat(data.extraPayment.replace(/[,%$]/gm, "")),
    interest: parseFloat(data.interest.replace(/[,%$]/gm, "")),
    term: data.term,
  };

  const newState:HidePrice = {
    downPayment: state.downPayment,
    extraPayment: state.extraPayment,
    interest: state.interest,
    term: state.term,
  }

return _.isEqual(newState, newObj) ? false : true;
  
}
