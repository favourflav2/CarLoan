import * as React from "react";
import { FTVOppCost } from "../../../components/helperFunctions/oppCostFunctions/oppCostFunction";
import { HouseObjWithFormattedData } from "../../../redux/features/modalSlices/houseSlice";
import { HouseMonthlyPayment } from "../../../components/helperFunctions/loanfunctions/HouseLoanFuntion";
import BreakEvenSection from "./OppCostSectionPages/BreakEvenSection";
import GraphViewOppCost from "./OppCostSectionPages/GraphViewOppCost";
import SelectDropDown from "./SelectDropDown";
import RentSection from "./OppCostSectionPages/RentSection";
import DiffSection from "./OppCostSectionPages/DiffSection";

export interface IOppCostChartContainerProps {
  breakEvenOppCost: FTVOppCost | undefined;
  rentOppCost: FTVOppCost | undefined;
  diffOppCost: FTVOppCost | undefined;
  selectedGoal: HouseObjWithFormattedData;
  monthlyPayment: HouseMonthlyPayment;
}

export default function OppCostChartContainer({ breakEvenOppCost, rentOppCost, diffOppCost, selectedGoal, monthlyPayment }: IOppCostChartContainerProps) {
  const [view, setView] = React.useState("Graph View");

  const handleChange = (event: { target: { value: string } }) => {
    setView(event.target.value);
  };



  return (
    <div className="w-full h-auto flex flex-col xl:mt-0 mt-7">
      {/* Content */}
      <div className="w-full h-full flex flex-col">
        {/* Select View */}
        <div className=" sm:flex hidden items-center w-auto h-auto">
          <h1
            className={`sm:mr-8 mr-5 sm:text-base text-[15px] cursor-pointer ${view === "Graph View" ? "underline text-chartGreen font-bold" : "text-gray-400"}`}
            onClick={() => setView("Graph View")}
          >
            Graph View
          </h1>
          <h1
            className={`  cursor-pointer ${view === "Break Even" ? "underline text-chartGreen font-bold" : "text-gray-400"} sm:mr-8 mr-5 sm:text-base text-[15px]`}
            onClick={() => setView("Break Even")}
          >
            Break Even
          </h1>
          <h1 className={`  cursor-pointer ${view === "Rent" ? "underline text-chartGreen font-bold" : "text-gray-400"} sm:mr-8 mr-5 sm:text-base text-[15px]`} onClick={() => setView("Rent")}>
            Rent
          </h1>
          <h1 className={`cursor-pointer ${view === "Diff." ? "underline text-chartGreen font-bold" : "text-gray-400"} sm:mr-8 mr-5 sm:text-base text-[15px]`} onClick={() => setView("Diff.")}>
            Diff.
          </h1>
        </div>

        {/* Mobile Select View */}
        <SelectDropDown view={view} handleChange={handleChange} />

        {/* Horizontal Line */}
        <hr className="border my-1 border-gray-300" />

        {/* View Chart */}
        {view === "Graph View" && breakEvenOppCost && rentOppCost && diffOppCost && (
          <GraphViewOppCost breakEvenOppCost={breakEvenOppCost} rentOppCost={rentOppCost} diffOppCost={diffOppCost} selectedGoal={selectedGoal} monthlyPayment={monthlyPayment} />
        )}

        {/* Break Even */}
        {view === "Break Even" && breakEvenOppCost && <BreakEvenSection breakEvenOppCost={breakEvenOppCost} selectedGoal={selectedGoal} monthlyPayment={monthlyPayment} />}

        {/* Rent */}
        {view === "Rent" && rentOppCost && <RentSection rentOppCost={rentOppCost} selectedGoal={selectedGoal} monthlyPayment={monthlyPayment} />}

        {/* Diff */}
        {view === "Diff." && diffOppCost && <DiffSection diffOppCost={diffOppCost} selectedGoal={selectedGoal} monthlyPayment={monthlyPayment} />}

        {/* Small Text Explaining the charts */}
        <div className="w-full flex h-auto mt-3">
          <h1 className="sm:text-[15px] text-[13px] leading-relaxed">
            * We have discussed over and over that we cannot compare rent to mortgage payments, because a mortgage payment is not a non-recoverable cost. But if we add the non-recoverable cost
            associated with homeownership we can get an estimate on how much you would be paying per month. Once we get that value the charts above help visualize the concept that we iterated above.
            <span className="font-bold italic">“The difference in expected returns between property and stocks represents an opportunity cost”</span>. This concept is the foundation to what you are
            seeing above. The money being used to finance the purchase of a home could be invested into another investment vehicles that could have a higher expected return.
          </h1>
        </div>
      </div>
    </div>
  );
}


