import retirementSlice, { RetirementGoalNoFormat, RetirementGoals, RetirementSlice, addRetireGoal, removeRetireItem, initialState as retireinitialState } from "../../redux/features/modalSlices/retirementSlice"
import applicationSlice, { initialState, setSelectedGoal } from "../../redux/features/applicationSlice";


// Input data when first created
const testData:RetirementGoalNoFormat = {
    id:"Jul 1, 2024 4:35:45",
    type:"Retirement",
    currentAge:23,
    retireAge:67,
    lifeExpectancy:90,
    budget: "20000",
    preRate: "5",
    postRate: "3",
    inflation: "3",
    monthlyContribution: "500",
    savings: "200",
    title: "fake data",
    showInputs:true,
    creator:null,
    date:null
}

// Input data when inserted in array
const testDataInArr:RetirementGoals = {
    id:"Jul 1, 2024 4:35:45",
    type:"Retirement",
    currentAge:23,
    retireAge:67,
    lifeExpectancy:90,
    budget: 20000,
    preRate: 5,
    postRate: 3,
    inflation: 3,
    monthlyContribution: 500,
    savings: 200,
    title: "fake data",
    showInputs:true,
    creator:null,
    date:null
}

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect(){}
  }

describe("test for retirement no user", () => {

    window.ResizeObserver = ResizeObserver;
    test("initialize slice with initialValue", () => {
        const retireSliceInit = retirementSlice(retireinitialState, {type:"unknown"})
        expect(retireSliceInit).toBe(retireinitialState)
    })

    test("add retire goal and set selected goal to retire goal", () => {
        const afterReducerOperation = retirementSlice(
            retireinitialState,
            addRetireGoal(testData)
          );
        const setSelectedGoalTest = applicationSlice(
            initialState,
            setSelectedGoal(testDataInArr)
        )

        expect(afterReducerOperation.retireGoals[0]).toStrictEqual(testDataInArr)
        expect(setSelectedGoalTest.selectedGoal).toStrictEqual(testDataInArr)

    });

    test("delete obj from retire goal", () => {
        // I create the stucture of my state
        const state:RetirementSlice = {
            retireGoals:[testDataInArr],
            errors:null
        }
        
        // I can call a method on my state
        const deleteReducer = retirementSlice(
            state,
            removeRetireItem(testDataInArr)
        )

        // Then test to make sure the reducer i called is doing what its supposed to do
        expect(deleteReducer.retireGoals).toStrictEqual([])
    })

   


});

