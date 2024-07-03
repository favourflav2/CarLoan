import carModalSlice, { CarData, CarObj, CarObjWithFormattedData, addCarGoal, removeCarItem } from "../../redux/features/modalSlices/carModalSlice";
import { initialState } from "../../redux/features/modalSlices/carModalSlice";

const formattedData: CarObjWithFormattedData = {
  id: "Jul 3, 2024 2:07:16 am",
  name: "Carolla",
  price: 55555,
  mileage: 5555,
  downPayment: 5555,
  interest: 5,
  term: 60,
  img: "",
  modal: "AlfaRomeo",
  type: "Car",
  extraPayment: 0,
  showInputs: true,
  creator: null,
  date: null,
};
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const nonFormattedData: CarObj = {
  id: "Jul 3, 2024 2:07:16 am",
  name: "Carolla",
  price: "55555",
  mileage: "5555",
  downPayment: "5555",
  interest: "5",
  term: 60,
  img: "",
  modal: "AlfaRomeo",
  type: "Car",
  extraPayment: "0",
  showInputs: true,
  creator: null,
  date: null,
};

describe("test for car no user", () => {
  window.ResizeObserver = ResizeObserver;

  test("initialize slice with initialValue", () => {
    const carModalSliceInit = carModalSlice(initialState, { type: "unknown" });
    expect(carModalSliceInit).toBe(initialState);
  });

  test("add car goal", () => {
    const addCarGoalReducer = carModalSlice(initialState, addCarGoal(nonFormattedData));

    expect(addCarGoalReducer.carGoals[0]).toStrictEqual(formattedData);
  });

  test("delete from house goal", () => {
    const state: CarData = {
      carGoals: [formattedData],
      error: "",
      singleOrGridView: false,
    };

    const deleteCarGoalReducer = carModalSlice(state, removeCarItem(formattedData));

    expect(deleteCarGoalReducer.carGoals).toStrictEqual(initialState.carGoals);
  });
});
