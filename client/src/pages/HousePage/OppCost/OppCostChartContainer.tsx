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

  //const totalPaid = USDollar.format(Number(monthlyPayment.totalAmountPaid.toFixed(2)));
  //const totalInterst = USDollar.format(Number(monthlyPayment.interestSum.toFixed(2)));

  //console.log(breakEvenPerMonth)

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
          <h1
            className={`  cursor-pointer ${view === "Summary View" ? "underline text-chartGreen font-bold" : "text-gray-400"} sm:mr-8 mr-5 sm:text-base text-[15px]`}
            onClick={() => setView("Summary View")}
          >
            Summary View
          </h1>
        </div>

        {/* Mobile Select View */}
        <SelectDropDown view={view} handleChange={handleChange}/>

       

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
      </div>
    </div>
  );
}

// <OppCostPieChart obj={breakEvenOppCost}/>

// // // <div className="w-auto flex flex-col h-auto">
// // //     <h1 className=" underline font-bold mb-[4px]">Home Purchase</h1>
// // //     <p className="text-[15px]">
// // //       For a <span className="font-bold italic">{USDollar.format(selectedGoal.price)}</span> house you would have paid <span className="font-bold italic">{totalPaid}</span>, and{" "}
// // //       <span className="font-bold italic">{totalInterst}</span> of that would have been in interest. However, we’ve already discussed in order to compare our mortgage we need to access the
// // //       total non-recoverable costs of homeownership.
// // //     </p>

// // //     <p className="text-[15px] mt-2">
// // //       So for a <span className="font-bold italic">{USDollar.format(selectedGoal.price)}</span> house, implementing the non-recoverable costs of homeownership you would have paid approx.{" "}
// // //       <span className="font-bold italic">{USDollar.format(Number(oppCostFVWithBreakEvenAsPayment(selectedGoal.term, breakEvenPerMonth, selectedGoal.downPayment).toFixed(2)))}</span> over the
// // //       course of your mortgage.
// // //     </p>

// // //     <p>add more here</p>
// // //   </div>
