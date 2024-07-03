import houseSlice, { HouseData, HouseObj, HouseObjWithFormattedData, addHouseGoal, removeHouseGoal } from "../../redux/features/modalSlices/houseSlice";
import { initialState } from "../../redux/features/modalSlices/houseSlice";

const nonFormattedData: HouseObj = {
  id: "Jul 3, 2024 1:43:39 am",
  streetAddress: "5456 desert",
  price: "555555",
  downPayment: "5555",
  interest: "5",
  term: 30,
  extraPayment: "0",
  img: "image",
  propertyTax: "1.11",
  insurance: "209.27",
  mortgageInsurance: "5",
  appreciation: "2",
  opportunityCostRate: "7",
  maintenance: "1",
  rent: "1515",
  type: "House",
  showInputs: true,
  showOppCostInputs: true,
  creator: null,
  date: null,
};

const formattedData: HouseObjWithFormattedData = {
  id: "Jul 3, 2024 1:43:39 am",
  streetAddress: "5456 desert",
  price: 555555,
  downPayment: 5555,
  interest: 5,
  term: 30,
  extraPayment: 0,
  img: "image",
  propertyTax: 1.11,
  insurance: 209.27,
  mortgageInsurance: 5,
  appreciation: 2,
  opportunityCostRate: 7,
  maintenance: 1,
  rent: 1515,
  type: "House",
  showTax: "monthlyPaymentWithNoTax",
  showInputs: true,
  showOppCostInputs: true,
  creator: null,
  date: null,
};

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("test for house no user", () => {
  window.ResizeObserver = ResizeObserver;

  test("initialize slice with initialValue", () => {
    const houseSliceInit = houseSlice(initialState, { type: "unknown" });
    expect(houseSliceInit).toBe(initialState);
  });

  test("add house goal", () => {
    const addHouseGoalReducer = houseSlice(initialState, addHouseGoal(nonFormattedData));

    expect(addHouseGoalReducer.houseGoals[0]).toStrictEqual(formattedData);
  });

  test("delete from house goal", () => {
    const state: HouseData = {
      houseGoals: [formattedData],
      error: "",
      singleOrGridView: false,
    };

    const deleteHouseReducer = houseSlice(
        state,
        removeHouseGoal(formattedData)
    )

    expect(deleteHouseReducer.houseGoals).toStrictEqual(initialState.houseGoals)
  });
});
